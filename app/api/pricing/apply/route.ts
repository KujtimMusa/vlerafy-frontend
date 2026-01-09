/**
 * API Route: Apply Price to Shopify
 * Next.js 14 App Router API Route
 */

import { NextRequest, NextResponse } from 'next/server'
import { API_URL } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, new_price } = body
    
    // Validate
    if (!product_id || !new_price) {
      return NextResponse.json(
        { error: 'Missing required fields: product_id and new_price' },
        { status: 400 }
      )
    }
    
    // Get session ID from cookies or headers
    const sessionId = request.cookies.get('session_id')?.value || 
                     request.headers.get('X-Session-ID') || 
                     `session_${Date.now()}`
    
    // Forward to backend
    const response = await fetch(
      `${API_URL}/recommendations/apply/${product_id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId
        },
        body: JSON.stringify({ 
          product_id, 
          new_price,
          apply_to_shopify: true
        })
      }
    )
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
      return NextResponse.json(
        { error: error.detail || 'Failed to apply price' },
        { status: response.status }
      )
    }
    
    const result = await response.json()
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Error applying price:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}















