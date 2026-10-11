begin;

grant select, insert, update, delete on public.chat_sessions to service_role;
grant select, insert, update, delete on public.chat_messages to service_role;
grant select, insert, update, delete on public.builds to service_role;

commit;
