import {createClient} from "@supabase/supabase-js";

export const supabase = createClient(
    "https://ecjfhriteprihjhzhvyd.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjamZocml0ZXByaWhqaHpodnlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1OTA0MDEsImV4cCI6MjA0NTE2NjQwMX0.OWm1YDxTJzVj2y-vcPssn0ISH_jJXVTN0LlMrcMyDtk"
)