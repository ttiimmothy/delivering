'use client'

import { useState } from 'react'
import { Search, ChevronDown, ChevronRight, HelpCircle, MessageCircle, Phone, Mail, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

// FAQ data
const faqCategories = [
  {
    id: 'ordering',
    title: 'Ordering & Payment',
    icon: '🍽️',
    faqs: [
      {
        question: 'How do I place an order?',
        answer: 'To place an order, simply browse our restaurant listings, select your desired items, add them to your cart, and proceed to checkout. You can pay using credit/debit cards, PayPal, or other supported payment methods.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and in some areas, cash on delivery.'
      },
      {
        question: 'Can I modify or cancel my order?',
        answer: 'You can modify or cancel your order within 5 minutes of placing it. After that, you\'ll need to contact the restaurant directly or our customer support team.'
      },
      {
        question: 'Are there any delivery fees?',
        answer: 'Delivery fees vary by restaurant and distance. Most restaurants offer free delivery on orders over a certain amount. The exact fee will be shown during checkout.'
      }
    ]
  },
  {
    id: 'delivery',
    title: 'Delivery & Tracking',
    icon: '🚚',
    faqs: [
      {
        question: 'How long does delivery take?',
        answer: 'Delivery times typically range from 20-45 minutes depending on the restaurant, distance, and current demand. You\'ll see an estimated delivery time when you place your order.'
      },
      {
        question: 'Can I track my order in real-time?',
        answer: 'Yes! Once your order is confirmed, you can track its progress in real-time through our app or website. You\'ll receive updates when your order is being prepared, picked up, and out for delivery.'
      },
      {
        question: 'What if my order is late?',
        answer: 'If your order is significantly late, please contact our customer support team. We\'ll investigate the delay and may provide compensation or a refund depending on the circumstances.'
      },
      {
        question: 'Can I contact my delivery driver?',
        answer: 'Yes, you can contact your delivery driver through the app once they\'re assigned to your order. This helps with coordination and any special delivery instructions.'
      }
    ]
  },
  {
    id: 'account',
    title: 'Account & Profile',
    icon: '👤',
    faqs: [
      {
        question: 'How do I create an account?',
        answer: 'Creating an account is easy! Click the "Sign Up" button, enter your email address, create a password, and verify your email. You can also sign up using your Google or Facebook account.'
      },
      {
        question: 'I forgot my password. How do I reset it?',
        answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a link to reset your password. Make sure to check your spam folder if you don\'t see the email.'
      },
      {
        question: 'How do I update my delivery address?',
        answer: 'Go to your account settings, select "Addresses," and you can add, edit, or delete delivery addresses. You can also set a default address for faster checkout.'
      },
      {
        question: 'Can I save my favorite restaurants?',
        answer: 'Yes! You can save your favorite restaurants by clicking the heart icon next to any restaurant. These will appear in your "Favorites" section for quick access.'
      }
    ]
  },
  {
    id: 'technical',
    title: 'Technical Support',
    icon: '🔧',
    faqs: [
      {
        question: 'The app is not working properly. What should I do?',
        answer: 'Try closing and reopening the app, or restart your device. If the problem persists, check your internet connection or try using our website instead. You can also contact our technical support team.'
      },
      {
        question: 'I\'m having trouble with payment processing.',
        answer: 'Make sure your payment method is valid and has sufficient funds. Try using a different payment method or contact your bank. If the issue continues, contact our support team with the error message you\'re seeing.'
      },
      {
        question: 'How do I report a bug?',
        answer: 'You can report bugs through the app\'s feedback section, email us at support@delivering.com, or contact our customer support team. Please include details about what happened and when.'
      },
      {
        question: 'Is my personal information secure?',
        answer: 'Yes, we take your privacy and security seriously. We use industry-standard encryption to protect your data and never share your personal information with third parties without your consent.'
      }
    ]
  }
]

const contactMethods = [
  {
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    icon: MessageCircle,
    availability: '24/7',
    action: 'Start Chat',
    color: 'text-blue-500'
  },
  {
    title: 'Phone Support',
    description: 'Speak directly with a support agent',
    icon: Phone,
    availability: 'Mon-Fri 8AM-8PM',
    action: 'Call Now',
    color: 'text-green-500'
  },
  {
    title: 'Email Support',
    description: 'Send us a detailed message',
    icon: Mail,
    availability: 'Response within 24h',
    action: 'Send Email',
    color: 'text-purple-500'
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

  const toggleFaq = (categoryId: string, faqIndex: number) => {
    const faqId = `${categoryId}-${faqIndex}`
    setExpandedFaq(expandedFaq === faqId ? null : faqId)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Icon className={`h-12 w-12 ${method.color} mx-auto mb-4`} />
                  <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                  <p className="text-muted-foreground mb-4">{method.description}</p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    <span>{method.availability}</span>
                  </div>
                  <Button className="w-full">{method.action}</Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>
            {faqCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon} {category.title}
              </Button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-6">
            {filteredFaqs
              .filter(category => selectedCategory === null || category.id === selectedCategory)
              .map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="text-2xl">{category.icon}</span>
                      <span>{category.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.faqs.map((faq, index) => {
                        const faqId = `${category.id}-${index}`
                        const isExpanded = expandedFaq === faqId
                        
                        return (
                          <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                            <button
                              className="w-full text-left flex justify-between items-center py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2"
                              onClick={() => toggleFaq(category.id, index)}
                            >
                              <span className="font-medium">{faq.question}</span>
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                            
                            {isExpanded && (
                              <div className="mt-2 pl-2">
                                <p className="text-muted-foreground leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                No FAQs found matching your search.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory(null)
                }}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>

        {/* Additional Help */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? Our support team is here to help you 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Live Chat
              </Button>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
