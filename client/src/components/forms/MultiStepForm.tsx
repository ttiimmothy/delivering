import React, { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

interface Step {
  title: string;
  description?: string;
  fields: React.ReactNode;
  validation?: () => boolean;
}

interface MultiStepFormProps<T extends Record<string, any>> {
  steps: Step[];
  onSubmit: (data: T) => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
  showProgress?: boolean;
  formMethods?: UseFormReturn<T>;
}

export function MultiStepForm<T extends Record<string, any>>({
  steps,
  onSubmit,
  isLoading = false,
  className = '',
  showProgress = true,
  formMethods,
}: MultiStepFormProps<T>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Always call useForm, but use the provided methods if available
  const defaultMethods = useForm<T>();
  const methods = formMethods || defaultMethods;
  const { handleSubmit, trigger, formState: { errors } } = methods;

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = async () => {
    const currentStepFields = steps[currentStep].fields;
    const fieldNames = getFieldNamesFromStep(currentStepFields);
    
    const isValid = await trigger(fieldNames as any);
    
    if (isValid && steps[currentStep].validation?.()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleFormSubmit = async (data: T) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to extract field names from step fields
  const getFieldNamesFromStep = (fields: React.ReactNode): string[] => {
    // This is a simplified approach - in a real implementation,
    // you might want to use a more sophisticated method to extract field names
    const fieldNames: string[] = [];
    
    // For now, we'll return an empty array and rely on the trigger() call
    // without specific field names, which will validate all fields
    return fieldNames;
  };

  return (
    <div className={className}>
      {/* Progress Steps */}
      {showProgress && (
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          {steps[currentStep].description && (
            <p className="text-muted-foreground">{steps[currentStep].description}</p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Current Step Fields */}
            {steps[currentStep].fields}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isFirstStep}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>

              {isLastStep ? (
                <Button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="flex items-center space-x-2"
                >
                  {isLoading || isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Create Account</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
