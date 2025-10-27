import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Heart, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">About Holiday Planner</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Our mission is to make travel planning seamless, personalized, and delightful for everyone.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="items-center">
                <div className="p-3 bg-primary/10 rounded-full">
                    <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                To empower travelers with intelligent tools that transform the complexity of trip planning into an experience of joy and discovery. We believe that the journey should be as beautiful as the destination.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="items-center">
                <div className="p-3 bg-primary/10 rounded-full">
                    <Heart className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                We are driven by a passion for exploration, a commitment to innovation, and a dedication to our users. We value simplicity, reliability, and the power of technology to connect people with the world.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="items-center">
                <div className="p-3 bg-primary/10 rounded-full">
                    <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Our Team</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                We are a diverse team of developers, designers, and travel enthusiasts united by a single goal: to build the best holiday planning tool on the planet. We are constantly innovating to improve your travel experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
