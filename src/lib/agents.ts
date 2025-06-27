import type { ElementType } from 'react';
import {
  BrainCircuit,
  ClipboardList,
  Palette,
  Accessibility,
  Code,
} from 'lucide-react';
import { UnityIcon } from '@/components/icons/unity-icon';

export interface Agent {
  id: string;
  name: string;
  icon: ElementType;
  color: string; // background color class for chat bubble
  primaryColorHSL: string; // for theme override
  avatarLabel: string;
}

export const agents: Agent[] = [
    { id: 'analyst', name: 'Analyst', icon: BrainCircuit, color: 'bg-cyan-900/40', primaryColorHSL: '180 65% 52%', avatarLabel: 'A' },
    { id: 'product-manager', name: 'Product Manager', icon: ClipboardList, color: 'bg-green-900/40', primaryColorHSL: '145 63% 42%', avatarLabel: 'PM' },
    { id: 'designer', name: 'Designer', icon: Palette, color: 'bg-yellow-900/40', primaryColorHSL: '48 96% 58%', avatarLabel: 'D' },
    { id: 'ux-designer', name: 'UX Designer', icon: Accessibility, color: 'bg-blue-900/40', primaryColorHSL: '221 83% 53%', avatarLabel: 'UX' },
    { id: 'software-developer', name: 'Software Developer', icon: Code, color: 'bg-orange-900/40', primaryColorHSL: '25 95% 53%', avatarLabel: 'S' },
    { id: 'unity-developer', name: 'Unity Developer', icon: UnityIcon, color: 'bg-gray-700/40', primaryColorHSL: '220 9% 46%', avatarLabel: 'U' },
];

export const defaultPrimaryColorHSL = '284 84% 54%';
