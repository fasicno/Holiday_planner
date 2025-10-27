import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const blogPosts = [
  {
    title: "10 Must-Visit Hidden Gems in Southeast Asia",
    date: "June 15, 2024",
    category: "Travel Guides",
    excerpt: "Forget the crowded tourist spots. Discover the most breathtaking, off-the-beaten-path destinations that Southeast Asia has to offer.",
    imageUrl: "https://picsum.photos/seed/blog1/600/400",
    imageHint: "tropical beach",
    slug: "/blog/hidden-gems-asia",
  },
  {
    title: "How to Plan a European Backpacking Trip on a Budget",
    date: "June 10, 2024",
    category: "Tips & Tricks",
    excerpt: "Traveling across Europe doesn't have to break the bank. Here are our top tips for accommodation, transport, and food to help you save.",
    imageUrl: "https://picsum.photos/seed/blog2/600/400",
    imageHint: "europe street",
    slug: "/blog/europe-budget-trip",
  },
  {
    title: "The Ultimate Guide to Solo Travel for Beginners",
    date: "June 5, 2024",
    category: "Solo Travel",
    excerpt: "Thinking about embarking on your first solo adventure? This guide covers everything you need to know, from safety tips to packing essentials.",
    imageUrl: "https://picsum.photos/seed/blog3/600/400",
    imageHint: "solo traveler",
    slug: "/blog/solo-travel-guide",
  },
   {
    title: "A Foodie's Tour of Italy: Beyond Pizza and Pasta",
    date: "May 28, 2024",
    category: "Food & Drink",
    excerpt: "Explore the rich and diverse culinary landscape of Italy. We take you on a journey through regional specialties you won't want to miss.",
    imageUrl: "https://picsum.photos/seed/blog4/600/400",
    imageHint: "italian food",
    slug: "/blog/foodie-tour-italy",
  },
];

export default function BlogPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Travel Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Inspiration, tips, and guides for your next adventure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.title} className="flex flex-col group">
             <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
                <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint={post.imageHint}
                />
            </div>
            <CardHeader>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="outline">{post.category}</Badge>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                    </div>
                </div>
              <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{post.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Link href={post.slug} className="font-semibold text-primary flex items-center gap-2">
                Read More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
