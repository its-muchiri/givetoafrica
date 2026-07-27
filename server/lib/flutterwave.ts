let _flutterwave: any = null

export async function getFlutterwave() {
  if (!_flutterwave) {
    const FlutterwaveModule = await import('flutterwave-node-v3')
    const Flutterwave = FlutterwaveModule.default
    _flutterwave = new Flutterwave(
      process.env.FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_placeholder',
      process.env.FLUTTERWAVE_SECRET_KEY || 'FLWSECK_placeholder',
      process.env.FLUTTERWAVE_ENCRYPTION_KEY || 'FLWSECK_placeholder_enc'
    )
  }
  return _flutterwave
}
