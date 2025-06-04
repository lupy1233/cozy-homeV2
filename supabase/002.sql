/* =============================================================
   001_rls_full.sql   –   Row-Level Security for ALL tables
   (helpers + every policy, including categories & questions)
   ============================================================= */

---------------------------------------------------------------
-- 0 ▸ HELPER FUNCTIONS
---------------------------------------------------------------
create or replace function auth_uid()
returns uuid language sql stable as
$$
select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

create or replace function jwt_role()
returns text language sql stable as
$$
select current_setting('request.jwt.claim.role', true);
$$;

create or replace function is_admin()
returns boolean language sql stable as
$$
select jwt_role() = 'ADMIN';
$$;

---------------------------------------------------------------
-- 1 ▸ PROFILES
---------------------------------------------------------------
alter table profiles enable row level security;

create policy profiles_select
  on profiles for select
  using (profiles.user_id = auth_uid() or is_admin());

create policy profiles_update
  on profiles for update
  using (profiles.user_id = auth_uid())
  with check (profiles.user_id = auth_uid());

create policy profiles_insert
  on profiles for insert
  with check (profiles.user_id = auth_uid());

---------------------------------------------------------------
-- 2 ▸ FIRMS
---------------------------------------------------------------
alter table firms enable row level security;

create policy firms_select
  on firms for select
  using (
      is_admin()
      or exists (
          select 1
          from firm_members fm
          where fm.firm_id = firms.id
            and fm.user_id = auth_uid()
            and fm.deleted_at is null)
  );

create policy firms_update_ceo
  on firms for update
  using (
      exists (
          select 1
          from firm_members fm
          where fm.firm_id = firms.id
            and fm.user_id = auth_uid()
            and fm.member_role = 'CEO'
            and fm.deleted_at is null)
  );

---------------------------------------------------------------
-- 3 ▸ FIRM_MEMBERS
---------------------------------------------------------------
alter table firm_members enable row level security;

create policy fm_select
  on firm_members for select
  using (
      is_admin()
      or exists (
          select 1
          from firm_members fm2
          where fm2.firm_id  = firm_members.firm_id
            and fm2.user_id  = auth_uid()
            and fm2.member_role = 'CEO'
            and fm2.deleted_at is null)
  );

create policy fm_insert
  on firm_members for insert
  with check (
      exists (
          select 1
          from firm_members fm2
          where fm2.firm_id  = firm_members.firm_id
            and fm2.user_id  = auth_uid()
            and fm2.member_role = 'CEO'
            and fm2.deleted_at is null)
  );

create policy fm_delete
  on firm_members for delete
  using (
      exists (
          select 1
          from firm_members fm2
          where fm2.firm_id  = firm_members.firm_id
            and fm2.user_id  = auth_uid()
            and fm2.member_role = 'CEO'
            and fm2.deleted_at is null)
  );

---------------------------------------------------------------
-- 4 ▸ HOMES
---------------------------------------------------------------
alter table homes enable row level security;

create policy homes_select
  on homes for select
  using (homes.owner_id = auth_uid() or is_admin());

create policy homes_crud
  on homes for all
  using (homes.owner_id = auth_uid())
  with check (homes.owner_id = auth_uid());

---------------------------------------------------------------
-- 5 ▸ FURNITURE_REQUESTS
---------------------------------------------------------------
alter table furniture_requests enable row level security;

create policy fr_select
  on furniture_requests for select
  using (
      furniture_requests.creator_id = auth_uid()
      or is_admin()
      or exists (
          select 1
          from request_assignments ra
          join firm_members fm
            on fm.firm_id = ra.firm_id
          where ra.request_id = furniture_requests.id
            and fm.user_id    = auth_uid()
            and fm.deleted_at is null)
  );

create policy fr_insert
  on furniture_requests for insert
  with check (
      furniture_requests.creator_id = auth_uid()
      and jwt_role() in ('HOMEOWNER','ARCHITECT')
  );

create policy fr_update
  on furniture_requests for update
  using (
      furniture_requests.creator_id = auth_uid()
      and furniture_requests.status in ('DRAFT','OPEN')
  );

create policy fr_delete
  on furniture_requests for delete
  using (
      furniture_requests.creator_id = auth_uid()
      and furniture_requests.status = 'DRAFT'
  );

---------------------------------------------------------------
-- 6 ▸ REQUEST_ASSIGNMENTS
---------------------------------------------------------------
alter table request_assignments enable row level security;

create policy ra_select
  on request_assignments for select
  using (
      is_admin()
      or exists (
          select 1
          from furniture_requests fr
          where fr.id = request_assignments.request_id
            and fr.creator_id = auth_uid())
      or exists (
          select 1
          from firm_members fm
          where fm.firm_id = request_assignments.firm_id
            and fm.user_id = auth_uid()
            and fm.deleted_at is null)
  );

create policy ra_insert
  on request_assignments for insert
  with check (
      exists (
          select 1
          from firm_members fm
          where fm.firm_id = request_assignments.firm_id
            and fm.user_id = auth_uid()
            and fm.deleted_at is null)
  );

create policy ra_update
  on request_assignments for update
  using (
      exists (
          select 1
          from firm_members fm
          where fm.firm_id = request_assignments.firm_id
            and fm.user_id = auth_uid()
            and fm.deleted_at is null)
      or exists (
          select 1
          from furniture_requests fr
          where fr.id = request_assignments.request_id
            and fr.creator_id = auth_uid())
      or is_admin()
  );

---------------------------------------------------------------
-- 7 ▸ THREADS
---------------------------------------------------------------
alter table threads enable row level security;

create policy threads_select
  on threads for select
  using (
      is_admin()
      or exists (
          select 1
          from request_assignments ra
          join firm_members fm on fm.firm_id = ra.firm_id
          where ra.request_id = threads.request_id
            and ra.firm_id    = threads.firm_id
            and (
                 fm.user_id = auth_uid()
              or ra.request_id in (
                   select fr.id
                   from furniture_requests fr
                   where fr.id = threads.request_id
                     and fr.creator_id = auth_uid())
            )
      )
  );

---------------------------------------------------------------
-- 8 ▸ MESSAGES
---------------------------------------------------------------
alter table messages enable row level security;

create policy msg_select
  on messages for select
  using (
      is_admin()
      or exists (
          select 1
          from threads t
          join request_assignments ra on ra.request_id = t.request_id
          join firm_members fm        on fm.firm_id     = ra.firm_id
          where t.id = messages.thread_id
            and (
                 fm.user_id = auth_uid()
              or ra.request_id in (
                   select fr.id
                   from furniture_requests fr
                   where fr.id = t.request_id
                     and fr.creator_id = auth_uid())
            )
      )
  );

create policy msg_insert
  on messages for insert
  with check (
      exists (
          select 1
          from threads t
          join request_assignments ra on ra.request_id = t.request_id
          join firm_members fm        on fm.firm_id     = ra.firm_id
          where t.id = messages.thread_id
            and (
                 fm.user_id = auth_uid()
              or ra.request_id in (
                   select fr.id
                   from furniture_requests fr
                   where fr.id = t.request_id
                     and fr.creator_id = auth_uid())
            )
      )
  );

---------------------------------------------------------------
-- 9 ▸ REQUEST_REVIEWS
---------------------------------------------------------------
alter table request_reviews enable row level security;

create policy rev_select
  on request_reviews for select
  using (
      is_admin()
      or request_reviews.reviewer_id = auth_uid()
      or exists (
          select 1
          from firm_members fm
          where fm.firm_id = request_reviews.firm_id
            and fm.user_id = auth_uid()
            and fm.deleted_at is null)
  );

create policy rev_insert
  on request_reviews for insert
  with check (request_reviews.reviewer_id = auth_uid());

---------------------------------------------------------------
-- 10 ▸ EVENTS_RAW  (admin only)
---------------------------------------------------------------
alter table events_raw enable row level security;

create policy events_admin
  on events_raw for select
  using (is_admin());

---------------------------------------------------------------
-- 11 ▸ FX_RATES  (admin read; service-role writes)
---------------------------------------------------------------
alter table fx_rates enable row level security;

create policy fx_select_admin
  on fx_rates for select
  using (is_admin());

---------------------------------------------------------------
-- 12 ▸ PLANS  (public read; admin write)
---------------------------------------------------------------
alter table plans enable row level security;

create policy plans_public_read
  on plans for select
  using (true);

create policy plans_admin_write
  on plans for all
  using (is_admin())
  with check (is_admin());

---------------------------------------------------------------
-- 13 ▸ REQUEST_CATEGORIES  (public read; admin write)
---------------------------------------------------------------
alter table request_categories enable row level security;

create policy rc_public_read
  on request_categories for select
  using (true);

create policy rc_admin_write
  on request_categories for all
  using (is_admin())
  with check (is_admin());

---------------------------------------------------------------
-- 14 ▸ REQUEST_QUESTIONS  (public read; admin write)
---------------------------------------------------------------
alter table request_questions enable row level security;

create policy rq_public_read
  on request_questions for select
  using (true);

create policy rq_admin_write
  on request_questions for all
  using (is_admin())
  with check (is_admin());

---------------------------------------------------------------
-- 15 ▸ REQUEST_ANSWERS  (public read; admin write)
---------------------------------------------------------------

alter table request_answers enable row level security;

create policy ra_public_read
  on request_answers for select
  using (true);

create policy ra_admin_write
  on request_answers for all
  using (is_admin())
  with check (is_admin());

  /* =============================================================
   END OF FILE  – Run once in Supabase SQL editor
   ============================================================= */
