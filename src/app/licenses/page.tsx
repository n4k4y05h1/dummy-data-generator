import fs from 'fs';
import path from 'path';
import Link from 'next/link'; // Import Link
import { ArrowLeftIcon } from '@heroicons/react/20/solid'; // Import ArrowLeftIcon

// This component will be a Server Component by default in app/
export default async function LicensesPage() {
  const noticesPath = path.join(process.cwd(), 'THIRD_PARTY_NOTICES.md');
  const noticesContent = fs.readFileSync(noticesPath, 'utf-8'); // Read synchronously at build/request time

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ display: 'block', marginBottom: '20px', color: '#0070f3', textDecoration: 'none' }}>
        <ArrowLeftIcon style={{ height: '1em', width: '1em', display: 'inline-block', verticalAlign: 'middle', marginRight: '5px' }} /> Back to Home
      </Link>
      <h1>Third-Party Notices</h1>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', backgroundColor: '#f4f4f4', padding: '15px', borderRadius: '5px' }}>
        {noticesContent}
      </pre>
    </div>
  );
}
