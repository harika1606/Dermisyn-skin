import React from 'react';
import { 
  AlertTriangle, 
  Search, 
  Activity, 
  CheckCircle, 
  Info, 
  Shield, 
  Zap 
} from 'lucide-react';

export const CLASSES = [
  {
    id: 'melanoma',
    name: 'Melanoma / Nevi',
    description: 'Malignant tumor of melanocytes, representing the most lethal form of skin cancer.',
    presentation: 'Irregular borders, multi-colored pigmentation, and asymmetrical growth.',
    criteria: 'ABCDE Rule: Asymmetry, Border irregularity, Color variegation, Diameter >6mm, Evolving.',
    risk: 'Critical / High Risk',
    color: '#ef4444',
    icon: <AlertTriangle className="w-5 h-5" />,
    is_malignant: true
  },
  {
    id: 'bcc',
    name: 'AK / BCC',
    description: 'Basal Cell Carcinoma and Actinic Keratosis. Sun-induced malignant lesions.',
    presentation: 'AK: Scaly patches. BCC: Pearly nodules with visible telangiectasias.',
    criteria: 'Pearly sheen, non-healing "rodent ulcers", and central crusting.',
    risk: 'High / Precancerous',
    color: '#f97316',
    icon: <Search className="w-5 h-5" />,
    is_malignant: true
  },
  {
    id: 'psoriasis',
    name: 'Psoriasis / Lichen',
    description: 'Immune-mediated inflammatory disorders affecting skin and systemic health.',
    presentation: 'Well-demarcated silvery-scaled plaques on extensor surfaces.',
    criteria: 'Auspitz sign (pinpoint bleeding after scale removal) in Psoriasis.',
    risk: 'Benign / Chronic',
    color: '#06b6d4',
    icon: <Activity className="w-5 h-5" />,
    is_malignant: false
  },
  {
    id: 'seborrheic',
    name: 'Seborrheic Keratosis',
    description: 'Acquired benign epithelial tumors. Highly prevalent in aging populations.',
    presentation: 'Waxy, "stuck-on" appearance. Texture ranges from smooth to verrucous.',
    criteria: 'Sharp demarcation, horn cysts, and absence of malignant network.',
    risk: 'Benign',
    color: '#10b981',
    icon: <CheckCircle className="w-5 h-5" />,
    is_malignant: false
  },
  {
    id: 'eczema',
    name: 'Eczema (Atopic)',
    description: 'Chronic inflammatory skin disease with intense pruritus and dry skin.',
    presentation: 'Erythematous, ill-defined patches with weeping or crusting.',
    criteria: '"The Itch that Rashes". Associated with Asthma and Allergic Rhinitis.',
    risk: 'Inflammatory',
    color: '#7c3aed',
    icon: <Info className="w-5 h-5" />,
    is_malignant: false
  },
  {
    id: 'vascular',
    name: 'Vascular Tumors',
    description: 'Spectrum of lesions derived from blood vessels like angiomas.',
    presentation: 'Bright red to violaceous papules. Often bleeding friable nodules.',
    criteria: 'Diapsopy (blanching under pressure). Absence of pigment network.',
    risk: 'Benign / Reactive',
    color: '#ec4899',
    icon: <Shield className="w-5 h-5" />,
    is_malignant: false
  },
  {
    id: 'urticaria',
    name: 'Urticaria (Hives)',
    description: 'Transient skin reaction involving mast cell degranulation and histamine.',
    presentation: 'Migratory, edematous wheals with surrounding erythema (flare).',
    criteria: 'Lesions typically resolve <24h. Dermographism is often a hallmark.',
    risk: 'Reactive / Acute',
    color: '#3b82f6',
    icon: <Zap className="w-5 h-5" />,
    is_malignant: false
  }
];
