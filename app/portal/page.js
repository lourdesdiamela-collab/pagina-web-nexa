import { redirect } from 'next/navigation';

export default function PortalRedirect() {
  const crmUrl = process.env.NEXT_PUBLIC_CRM_URL || 'https://crm.nexagrowth.com.ar';
  redirect(`${crmUrl}/login`);
}
