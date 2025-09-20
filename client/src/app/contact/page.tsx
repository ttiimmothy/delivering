'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, User, Mail as MailIcon } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { contactSchema, type ContactFormData } from '../../schemas/forms'
import {FormField} from "../../components/forms/FormField";
import {FormSubmitButton} from "../../components/forms/FormSubmitButton";
import {FormSelect} from "../../components/forms/FormSelect";

const contactInfo = [
  {
    title: 'Customer Support',
    description: 'General inquiries, order issues, and account support',
    phone: '+1 (555) 123-4567',
    email: 'support@delivering.com',
    hours: '24/7',
    icon: MessageCircle,
    color: 'text-blue-500'
  },
  {
    title: 'Business Inquiries',
    description: 'Partnership opportunities and business development',
    phone: '+1 (555) 123-4568',
    email: 'business@delivering.com',
    hours: 'Mon-Fri 9AM-6PM',
    icon: User,
    color: 'text-green-500'
  },
  {
    title: 'Press & Media',
    description: 'Media inquiries and press releases',
    phone: '+1 (555) 123-4569',
    email: 'press@delivering.com',
    hours: 'Mon-Fri 9AM-5PM',
    icon: MailIcon,
    color: 'text-purple-500'
  }
]

const offices = [
  {
    city: 'San Francisco',
    address: '123 Market Street, Suite 100\nSan Francisco, CA 94105',
    phone: '+1 (555) 123-4567',
    hours: 'Mon-Fri 9AM-6PM PST'
  },
  {
    city: 'New York',
    address: '456 Broadway, Floor 15\nNew York, NY 10013',
    phone: '+1 (555) 123-4568',
    hours: 'Mon-Fri 9AM-6PM EST'
  },
  {
    city: 'Los Angeles',
    address: '789 Sunset Boulevard, Suite 200\nLos Angeles, CA 90028',
    phone: '+1 (555) 123-4569',
    hours: 'Mon-Fri 9AM-6PM PST'
  }
]

const inquiryTypes = [
  'General Inquiry',
  'Order Issue',
  'Account Support',
  'Technical Problem',
  'Business Partnership',
  'Press Inquiry',
  'Feedback',
  'Other'
]

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const methods = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      inquiryType: '',
      subject: '',
      message: ''
    }
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = methods

  const onSubmit = async (data: ContactFormData) => {
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      methods.reset()
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
            <p className="text-muted-foreground mb-4">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We're here to help! Get in touch with our team for any questions or concerns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      name="name"
                      label="Name"
                      placeholder="Enter your name"
                      register={register}
                      error={errors.name}
                      required
                    />
                    <FormField
                      name="email"
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      register={register}
                      error={errors.email}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      name="phone"
                      label="Phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      register={register}
                      error={errors.phone}
                    />
                    <FormField
                      name="company"
                      label="Company"
                      placeholder="Enter your company (optional)"
                      register={register}
                      error={errors.company}
                    />
                  </div>

                  <FormSelect
                    name="inquiryType"
                    label="Inquiry Type"
                    placeholder="Select inquiry type"
                    options={inquiryTypes.map(type => ({ value: type, label: type }))}
                    register={register}
                    error={errors.inquiryType}
                    required
                  />

                  <FormField
                    name="subject"
                    label="Subject"
                    placeholder="Enter message subject"
                    register={register}
                    error={errors.subject}
                    required
                  />

                  <FormField
                    name="message"
                    label="Message"
                    type="textarea"
                    placeholder="Enter your message"
                    register={register}
                    error={errors.message}
                    required
                    rows={6}
                  />

                  <FormSubmitButton
                    isLoading={isSubmitting}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </FormSubmitButton>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Icon className={`h-8 w-8 ${info.color} mt-1`} />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                            <p className="text-muted-foreground mb-3">{info.description}</p>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{info.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{info.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{info.hours}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Office Locations */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Our Offices</h2>
              <div className="space-y-4">
                {offices.map((office, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <MapPin className="h-6 w-6 text-red-500 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{office.city}</h3>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <p className="whitespace-pre-line">{office.address}</p>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>{office.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{office.hours}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Response */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Need immediate help?</h3>
                <p className="text-muted-foreground mb-4">
                  For urgent issues or immediate assistance, try our live chat or call our 24/7 support line.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Live Chat
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Common Questions</h2>
            <p className="text-muted-foreground">
              Find quick answers to frequently asked questions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How do I track my order?</h3>
                <p className="text-sm text-muted-foreground">
                  You can track your order in real-time through our app or website. You'll receive updates via email and SMS.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What if my order is wrong?</h3>
                <p className="text-sm text-muted-foreground">
                  Contact our support team immediately. We'll work with the restaurant to resolve the issue and provide a refund if necessary.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How do I become a courier?</h3>
                <p className="text-sm text-muted-foreground">
                  Visit our courier page to apply. You'll need a valid driver's license, vehicle, and pass a background check.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <a href="/help">View All FAQs</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
