import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pedido Recebido',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Pronto para Retirada',
  picked_up: 'Saiu para Entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
}

interface OrderStatusProps {
  currentStep: number
  steps: string[]
}

export function OrderStatus({ currentStep, steps }: OrderStatusProps) {
  return (
    <div className="relative">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep

        return (
          <div key={step} className="flex items-start gap-4 pb-8 last:pb-0">
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'absolute left-4 top-8 w-0.5 h-full',
                  isCompleted ? 'bg-green-500' : 'bg-gray-200'
                )}
              />
            )}
            <div
              className={cn(
                'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2',
                isCompleted && 'bg-green-500 border-green-500',
                isCurrent && 'bg-orange-500 border-orange-500',
                !isCompleted && !isCurrent && 'bg-white border-gray-300'
              )}
            >
              {isCompleted ? (
                <Check className="h-4 w-4 text-white" />
              ) : (
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    isCurrent ? 'bg-white' : 'bg-gray-300'
                  )}
                />
              )}
            </div>
            <div>
              <p
                className={cn(
                  'text-sm font-medium',
                  isCurrent && 'text-orange-500',
                  isCompleted && 'text-green-500'
                )}
              >
                {STATUS_LABELS[step] || step}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
