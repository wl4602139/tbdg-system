import { redirect } from 'next/navigation'

export default function ZeroCarbonPricePage() {
  redirect('/system?section=price&from=/zero-carbon')
}
