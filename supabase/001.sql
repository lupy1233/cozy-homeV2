/*********************************************************************
 * Enable PostGIS so we can use geography/geometry types & GIS funcs *
 *********************************************************************/
create extension if not exists postgis;

-- 1️⃣  ENUMS -----------------------------------------------------------
create type role_enum as enum (
  'HOMEOWNER','ARCHITECT','FIRM_CEO','FIRM_EMPLOYEE','ADMIN'
);
create type req_status_enum as enum (
  'DRAFT','OPEN','REDEEMED','QUOTED','ACCEPTED','DECLINED','EXPIRED'
);
create type event_type_enum as enum (
  'message_sent','message_read',
  'request_redeemed','quote_viewed','offer_read'
);

-- 2️⃣  PROFILES --------------------------------------------------------
create table profiles (
  user_id uuid primary key references auth.users on delete cascade,
  role role_enum not null,
  first_name text,
  last_name  text,
  phone text,
  last_login_at timestamptz,
  deleted_at timestamptz
);

-- 3️⃣  FIRMS & SUBSCRIPTIONS ------------------------------------------
create table firms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vat_number text,
  address_json jsonb,
  location_point geography(point,4326),   -- ✅ works now that PostGIS is on
  service_radius_km int,
  is_verified bool default false,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table firm_members (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid references firms on delete cascade,
  user_id uuid references profiles on delete cascade,
  member_role text check (member_role in ('CEO','EMPLOYEE')) not null,
  invited_at timestamptz default now(),
  accepted_at timestamptz,
  is_active bool default true,
  deleted_at timestamptz,
  unique (firm_id, user_id)
);

create table plans (
  id text primary key,
  name text,
  delay_min int,
  redeem_quota int,
  employee_quota int,
  price_cents int
);

insert into plans values
  ('starter','Starter',60,15,3,  9900),
  ('pro','Pro',15,60,10,19900),
  ('unlimited','Unlimited',0,null,null,49900);

create table firm_subscriptions (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid references firms on delete cascade,
  plan_id text references plans(id),
  status text check (status in ('active','past_due','canceled')) default 'active',
  stripe_customer_id text,
  current_period_end timestamptz,
  redeems_used_month int default 0,
  created_at timestamptz default now()
);

create table subscription_addons (
  id uuid primary key default gen_random_uuid(),
  firm_subscription_id uuid references firm_subscriptions on delete cascade,
  addon_type text check (addon_type='EMPLOYEE_SEAT'),
  qty int,
  purchased_at timestamptz default now(),
  expires_at timestamptz
);

-- 4️⃣  HOMES -----------------------------------------------------------
create table homes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles on delete cascade,
  name text,
  address_json jsonb,
  home_point geography(point,4326),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- 5️⃣  REQUESTS --------------------------------------------------------
create table furniture_requests (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references profiles on delete cascade,
  home_id uuid references homes,
  primary_category_id uuid,
  title text,
  brief_text text,
  status req_status_enum default 'DRAFT',
  expires_at timestamptz,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table request_categories (
  id uuid primary key default gen_random_uuid(),
  name text,
  lang_code char(2) default 'en',
  translation_of uuid
);

create table request_questions (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references request_categories on delete cascade,
  question_text text,
  input_type text,
  lang_code char(2) default 'en',
  translation_of uuid
);

create table request_answers (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references furniture_requests on delete cascade,
  question_id uuid references request_questions,
  answer_json jsonb,
  deleted_at timestamptz
);

create table request_assignments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references furniture_requests on delete cascade,
  firm_id uuid references firms on delete cascade,
  redeemed_at timestamptz default now(),
  quoted_at timestamptz,
  price_cents bigint,
  currency_code char(3),
  fx_rate_eur numeric,
  accepted_at timestamptz,
  declined_at timestamptz,
  deleted_at timestamptz,
  unique (request_id, firm_id)
);

-- 6️⃣  REVIEWS ---------------------------------------------------------
create table request_reviews (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references furniture_requests on delete cascade,
  firm_id uuid references firms on delete cascade,
  reviewer_id uuid references profiles,
  rating int check (rating between 1 and 5),
  body_text text,
  photo_keys text[],
  created_at timestamptz default now(),
  deleted_at timestamptz,
  check (rating > 2 or body_text is not null)
);

-- 7️⃣  MESSAGING -------------------------------------------------------
create table threads (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references furniture_requests on delete cascade,
  firm_id uuid references firms on delete cascade,
  created_at timestamptz default now(),
  deleted_at timestamptz,
  unique (request_id, firm_id)
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references threads on delete cascade,
  sender_id uuid references profiles,
  body text,
  attachment_keys text[],
  sent_at timestamptz default now(),
  seen_at timestamptz,
  deleted_at timestamptz
);

-- 8️⃣  EVENTS ----------------------------------------------------------
create table events_raw (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  event_type event_type_enum,
  payload jsonb,
  occurred_at timestamptz default now()
);

-- 9️⃣  FX RATES --------------------------------------------------------
create table fx_rates (
  currency_code char(3),
  rate_date date,
  rate numeric,
  primary key (currency_code, rate_date)
);

/* INDICES, VIEWS, TRIGGERS, ETC. – same as before */
