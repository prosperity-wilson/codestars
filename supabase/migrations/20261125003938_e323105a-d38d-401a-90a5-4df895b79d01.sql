
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

create policy "anyone uploads aid docs" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'private-documents' and (storage.foldername(name))[1] = 'incoming');
create policy "admins read private docs" on storage.objects for select to authenticated
  using (bucket_id = 'private-documents' and public.is_admin());
create policy "admins delete private docs" on storage.objects for delete to authenticated
  using (bucket_id = 'private-documents' and public.is_admin());
