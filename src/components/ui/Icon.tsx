import {
  Code,
  Zap,
  Shield,
  Database,
  Rocket,
  Eye,
  RefreshCw,
  Globe,
  Lock,
  BarChart,
  Layers,
  Cpu,
  type LucideProps,
} from 'lucide-react'
import type { ComponentType } from 'react'

const iconMap: Record<string, ComponentType<LucideProps>> = {
  code: Code,
  bolt: Zap,
  zap: Zap,
  shield: Shield,
  database: Database,
  rocket: Rocket,
  eye: Eye,
  'refresh-cw': RefreshCw,
  refresh: RefreshCw,
  globe: Globe,
  lock: Lock,
  'bar-chart': BarChart,
  layers: Layers,
  cpu: Cpu,
}

interface IconProps extends LucideProps {
  name: string
}

export function Icon({ name, size = 22, ...props }: IconProps) {
  const Component = iconMap[name.toLowerCase()]
  if (!Component) return null
  return <Component size={size} {...props} />
}
