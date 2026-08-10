-- Seed one demo login per platform role, bypassing GoTrue's email-confirmation
-- path (which is rate-limited on free-tier projects) by inserting directly
-- into auth.users/auth.identities with email_confirmed_at already set.

create extension if not exists pgcrypto;

do $$
declare
  v_password text := crypt('DemoPass123!', gen_salt('bf'));
  v_id uuid;
  acc record;
begin
  for acc in (
    select * from (values
      ('superadmin@digitallibrary.test', 'Demo Super Admin', 'super_admin', null::text),
      ('libraryadmin@digitallibrary.test', 'Demo Library Admin', 'library_admin', null),
      ('contentmanager@digitallibrary.test', 'Demo Content Manager', 'content_manager', null),
      ('digitizationmanager@digitallibrary.test', 'Demo Digitization Manager', 'digitization_manager', null),
      ('metadatalibrarian@digitallibrary.test', 'Demo Metadata Librarian', 'metadata_librarian', null),
      ('researcher@digitallibrary.test', 'Demo Researcher', 'researcher', null),
      ('librarian@digitallibrary.test', 'Demo Librarian', 'librarian', null),
      ('reviewerqc@digitallibrary.test', 'Demo Reviewer QC Officer', 'reviewer_qc', null),
      ('exhibitioncurator@digitallibrary.test', 'Demo Exhibition Curator', 'exhibition_curator', null),
      ('contributor@digitallibrary.test', 'Demo Contributor', 'contributor', null),
      ('institutionaluser@digitallibrary.test', 'Demo Institutional User', 'institutional_user', 'Partner University')
    ) as t(email, full_name, role, institution)
  )
  loop
    if not exists (select 1 from auth.users where email = acc.email) then
      v_id := gen_random_uuid();
      insert into auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, last_sign_in_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
      ) values (
        '00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated',
        acc.email, v_password, now(), now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('full_name', acc.full_name),
        now(), now(), '', '', '', ''
      );

      insert into auth.identities (
        id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
      ) values (
        gen_random_uuid(), v_id, v_id::text,
        jsonb_build_object('sub', v_id::text, 'email', acc.email),
        'email', now(), now(), now()
      );
    end if;

    update public.profiles
      set role = acc.role, institution = coalesce(acc.institution, institution)
      where id = (select id from auth.users where email = acc.email);
  end loop;
end $$;
