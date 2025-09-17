import { Shield, Eye, Lock, Database, Users, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: January 16, 2024
          </p>
        </div>

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Eye className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Transparency</h3>
              <p className="text-sm text-muted-foreground">
                We clearly explain what data we collect and how we use it.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Lock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Security</h3>
              <p className="text-sm text-muted-foreground">
                Your data is protected with industry-standard security measures.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Control</h3>
              <p className="text-sm text-muted-foreground">
                You have control over your personal information and preferences.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Policy Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Information We Collect</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <p className="text-muted-foreground mb-3">
                  We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Name, email address, and phone number</li>
                  <li>Delivery addresses and payment information</li>
                  <li>Order history and preferences</li>
                  <li>Communication preferences</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Usage Information</h3>
                <p className="text-muted-foreground mb-3">
                  We automatically collect certain information about your use of our services.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Device information and IP address</li>
                  <li>App usage and interaction data</li>
                  <li>Location data (with your permission)</li>
                  <li>Cookies and similar technologies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>How We Use Your Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Service Delivery</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Process and fulfill your orders</li>
                    <li>Provide customer support</li>
                    <li>Send order updates and notifications</li>
                    <li>Process payments</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Service Improvement</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Analyze usage patterns</li>
                    <li>Improve our services</li>
                    <li>Develop new features</li>
                    <li>Personalize your experience</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Communication</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Send promotional offers and updates (with your consent)</li>
                  <li>Respond to your inquiries and feedback</li>
                  <li>Send important service-related communications</li>
                  <li>Conduct surveys and research</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Information Sharing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Service Providers</h3>
                  <p className="text-sm text-muted-foreground">
                    We may share information with trusted third-party service providers who assist us in operating our platform, such as payment processors, delivery partners, and analytics providers.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Legal Requirements</h3>
                  <p className="text-sm text-muted-foreground">
                    We may disclose information when required by law, court order, or to protect our rights, property, or safety, or that of our users.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Business Transfers</h3>
                  <p className="text-sm text-muted-foreground">
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Consent</h3>
                  <p className="text-sm text-muted-foreground">
                    We may share information with your explicit consent for specific purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Data Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Technical Measures</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>SSL/TLS encryption for data transmission</li>
                    <li>Encrypted storage of sensitive data</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and authentication</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Organizational Measures</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Employee training on data protection</li>
                    <li>Limited access to personal information</li>
                    <li>Regular security assessments</li>
                    <li>Incident response procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                You have certain rights regarding your personal information. You can exercise these rights by contacting us or using the settings in your account.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Access and Portability</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Request a copy of your personal data</li>
                    <li>Export your data in a portable format</li>
                    <li>View your account information</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Correction and Deletion</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Update or correct your information</li>
                    <li>Delete your account and data</li>
                    <li>Request data deletion</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Communication Preferences</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Opt out of marketing communications</li>
                    <li>Manage notification preferences</li>
                    <li>Unsubscribe from emails</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Data Processing</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Object to certain data processing</li>
                    <li>Restrict data processing</li>
                    <li>Withdraw consent</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Types of Cookies</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                    <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Managing Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    You can control cookies through your browser settings or our cookie preference center. Note that disabling certain cookies may affect the functionality of our services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically for any changes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this privacy policy or our data practices, please contact us:
              </p>
              
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> privacy@delivering.com</p>
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
