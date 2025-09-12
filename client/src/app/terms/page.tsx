import { FileText, Scale, AlertTriangle, Shield, Users, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FileText className="h-16 w-16 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            These terms govern your use of our food delivery platform. Please read them carefully.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: January 16, 2024
          </p>
        </div>

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Scale className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Fair Terms</h3>
              <p className="text-sm text-muted-foreground">
                Clear, fair terms that protect both you and our platform.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Your Rights</h3>
              <p className="text-sm text-muted-foreground">
                We respect your rights and clearly explain your responsibilities.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">
                Terms that help maintain a safe and respectful community.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Terms Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                By accessing or using our food delivery platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>
              <p className="text-muted-foreground">
                These Terms apply to all visitors, users, and others who access or use the Service. We reserve the right to update these Terms at any time, and your continued use of the Service constitutes acceptance of any changes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our Service is a food delivery platform that connects customers with local restaurants and couriers. We facilitate the ordering, payment, and delivery of food items from participating restaurants to customers.
              </p>
              <div>
                <h3 className="font-semibold mb-2">What We Provide:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Access to restaurant menus and ordering system</li>
                  <li>Payment processing and order management</li>
                  <li>Real-time order tracking and delivery updates</li>
                  <li>Customer support and dispute resolution</li>
                  <li>Courier and restaurant partner services</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Creation</h3>
                <p className="text-muted-foreground mb-3">
                  To use certain features of our Service, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Account Termination</h3>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate your account at any time for violations of these Terms or for any other reason at our sole discretion.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Orders and Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Ordering Process</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Orders are subject to restaurant availability and acceptance</li>
                  <li>Prices may vary and are subject to change without notice</li>
                  <li>Delivery fees and taxes will be clearly displayed</li>
                  <li>Order modifications may be limited after placement</li>
                  <li>We reserve the right to refuse or cancel orders</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Payment Terms</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Payment is required at the time of order placement</li>
                  <li>We accept various payment methods as displayed</li>
                  <li>All prices are in the local currency unless otherwise specified</li>
                  <li>Refunds are subject to our refund policy</li>
                  <li>You authorize us to charge your payment method</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Delivery and Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Delivery Terms</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Delivery times are estimates and may vary</li>
                  <li>We are not responsible for delays beyond our control</li>
                  <li>Someone must be available to receive the order</li>
                  <li>We may require age verification for alcohol orders</li>
                  <li>Delivery areas are subject to availability</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Service Limitations</h3>
                <p className="text-muted-foreground">
                  While we strive to provide excellent service, we cannot guarantee that the Service will be uninterrupted, error-free, or completely secure. We are not responsible for any issues arising from:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4 mt-2">
                  <li>Restaurant food quality or preparation</li>
                  <li>Third-party courier services</li>
                  <li>Technical issues or system downtime</li>
                  <li>Weather conditions or natural disasters</li>
                  <li>Traffic or transportation delays</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. User Conduct</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Prohibited Activities</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Transmit harmful or malicious code</li>
                    <li>Attempt to gain unauthorized access</li>
                    <li>Interfere with Service operations</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Respectful Behavior</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Treat all users and staff with respect</li>
                    <li>Provide accurate information</li>
                    <li>Follow delivery instructions</li>
                    <li>Report any issues promptly</li>
                    <li>Use appropriate language and conduct</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Service and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              
              <div>
                <h3 className="font-semibold mb-2">Your Content</h3>
                <p className="text-muted-foreground">
                  You retain ownership of any content you submit to our Service. By submitting content, you grant us a non-exclusive, royalty-free, worldwide license to use, modify, and display such content in connection with the Service.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Our Content</h3>
                <p className="text-muted-foreground">
                  You may not copy, modify, distribute, sell, or lease any part of our Service or included software, nor may you reverse engineer or attempt to extract the source code of that software.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Disclaimers and Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">Important Legal Notice</h3>
                    <p className="text-sm text-yellow-700">
                      Please read this section carefully as it limits our liability to you.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Service Disclaimers</h3>
                <p className="text-muted-foreground mb-3">
                  The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Warranties of merchantability and fitness for a particular purpose</li>
                  <li>Warranties regarding accuracy, reliability, or completeness</li>
                  <li>Warranties that the Service will be uninterrupted or error-free</li>
                  <li>Warranties regarding third-party content or services</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Limitation of Liability</h3>
                <p className="text-muted-foreground">
                  To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Indemnification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You agree to defend, indemnify, and hold harmless our company, its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including attorney's fees) arising from:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4 mt-3">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Any content you submit to the Service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Governing Law</h3>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Dispute Resolution Process</h3>
                <p className="text-muted-foreground mb-3">
                  Any disputes arising out of or relating to these Terms or the Service shall be resolved through:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Good faith negotiations between the parties</li>
                  <li>Mediation if negotiations fail</li>
                  <li>Binding arbitration if mediation fails</li>
                  <li>Class action waiver applies</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> legal@delivering.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Market Street, Suite 100, San Francisco, CA 94105</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
