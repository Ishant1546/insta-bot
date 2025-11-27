
from supabase import create_client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_accounts():
    return supabase.table("accounts").select("*").execute().data

def add_account(username, password, tag="demo"):
    return supabase.table("accounts").insert({
        "username": username,
        "password": password,
        "tag": tag
    }).execute()

def delete_account(id):
    return supabase.table("accounts").delete().eq("id", id).execute()
