import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

export default function Home() {
  useEffect(() => {
    findStuff();
  }, []);

  const findStuff = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

    if (!supabaseKey || !supabaseUrl) {
      throw new Error("Missing db config in env");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: musings, error } = await supabase.from("musings").select("*");

    console.log(musings);
  };

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      yo
    </div>
  );
}
