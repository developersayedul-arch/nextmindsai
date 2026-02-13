import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import DOMPurify from "dompurify";

interface BlogPost {
  id: string;
  title: string;
  description: string | null;
  embed_code: string | null;
  source_url: string | null;
  source_type: string;
  thumbnail_url: string | null;
  published_at: string | null;
  created_at: string;
}

const EmbedRenderer = ({ html }: { html: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Allow iframes for embeds
    const clean = DOMPurify.sanitize(html, {
      ADD_TAGS: ["iframe"],
      ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "src", "width", "height", "style"],
    });
    ref.current.innerHTML = clean;

    // Execute any scripts (for widgets like Twitter/Instagram)
    const scripts = ref.current.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [html]);

  return <div ref={ref} className="embed-container w-full [&>iframe]:w-full [&>iframe]:rounded-lg [&>iframe]:min-h-[300px]" />;
};

const sourceColors: Record<string, string> = {
  facebook: "bg-blue-600",
  youtube: "bg-red-600",
  instagram: "bg-pink-500",
  twitter: "bg-sky-500",
  linkedin: "bg-blue-700",
  tiktok: "bg-black",
  article: "bg-primary",
};

const BlogPage = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  return (
    <Layout>
      <div className="section-container py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Blog & Updates</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            আমাদের লেটেস্ট আর্টিকেল, টিপস এবং সোশ্যাল মিডিয়া আপডেট
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground">লোড হচ্ছে...</div>
        ) : !posts?.length ? (
          <div className="text-center py-16 text-muted-foreground">কোনো পোস্ট এখনো নেই</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden flex flex-col">
                {post.thumbnail_url && (
                  <img src={post.thumbnail_url} alt={post.title} className="w-full h-48 object-cover" />
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${sourceColors[post.source_type] || "bg-primary"} text-white text-xs`}>
                      {post.source_type}
                    </Badge>
                    {post.published_at && (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(post.published_at), "dd MMM yyyy")}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-snug">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  {post.description && (
                    <p className="text-sm text-muted-foreground">{post.description}</p>
                  )}
                  {post.embed_code && <EmbedRenderer html={post.embed_code} />}
                  {post.source_url && (
                    <a
                      href={post.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      সোর্স দেখুন <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogPage;
