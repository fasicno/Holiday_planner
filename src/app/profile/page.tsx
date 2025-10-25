'use client';

import { useAuth } from '@/hooks/use-auth';
import { useDoc, useFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, isUserLoading, signOut } = useAuth();
  const { firestore } = useFirebase();
  const router = useRouter();

  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || isProfileLoading || !user) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.photoURL ?? undefined} />
            <AvatarFallback>
              {userProfile ? (
                `${userProfile.firstName?.[0] || ''}${userProfile.lastName?.[0] || ''}`
              ) : (
                <User />
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">
              {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'Your Profile'}
            </CardTitle>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </CardHeader>
        <CardContent>
          <Button onClick={signOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
