import ProfilePageClient from "./ProfilePageClient";

type Props = {
  params: Promise<{ email: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { email } = await params; // await params Promise here

  return <ProfilePageClient email={email} />;
}
