import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: "GO TO /api/bfhl",
    status: "redirect-info"
  }, {
    headers: { 'Access-Control-Allow-Origin': '*' }
  });
}
