import postgres from 'postgres';
import { NextResponse } from 'next/server';

//const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
async function listInvoices() {
  const sql = postgres(process.env.POSTGRES_URL!, {
    ssl: process.env.POSTGRES_SSL === 'false' ? false : 'require'
  });
  
  //console.log('sql is:', sql);

  const data = await sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `;

	return data;
}

export async function GET() {
  // return Response.json({
  //   message:
  //     'Uncomment this file and remove this line. You can delete this file when you are finished.',
  // });
  try {
    const data = await listInvoices();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database query failed', status: 500 });
  }
}
