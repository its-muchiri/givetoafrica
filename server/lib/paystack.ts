import axios from 'axios'

let _paystack: any = null

export function getPaystack() {
  if (!_paystack) {
    _paystack = axios.create({
      baseURL: 'https://api.paystack.co',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder'}`,
        'Content-Type': 'application/json',
      },
    })
  }
  return _paystack
}
