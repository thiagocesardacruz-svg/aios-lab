import React from 'react';
import { PageHeader, Input, TextArea, Button } from '../components/UI';
import { DNAParams } from '../types';
import { Save, Sparkles } from 'lucide-react';

interface PersonalizeProps {
    dna: DNAParams;
    onSave: (newDna: DNAParams) => void;
}

export const Personalize: React.FC<PersonalizeProps> = ({ dna, onSave }) => {
  const [formData, setFormData] = React.useState<DNAParams>(dna);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
        onSave(formData);
        setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-full mx-auto pb-20">
      <PageHeader 
        title="DNA da Marca" 
        subtitle="Configure a identidade que alimentará todas as IAs da plataforma." 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Context */}
        <div className="col-span-1 space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-violet-900/20 to-transparent border border-violet-500/10">
                <Sparkles className="w-8 h-8 text-violet-400 mb-4" />
                <h3 className="font-bold text-white mb-2">Por que isso importa?</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                    Estas informações são injetadas dinamicamente em cada prompt gerado. Quanto mais detalhado for o seu DNA, mais precisas e humanas serão as respostas da IA.
                </p>
            </div>
        </div>

        {/* Right Column: Form */}
        <div className="col-span-1 md:col-span-2 space-y-8 glass-panel p-8 rounded-3xl">
            
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Identidade Básica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                        label="Nome da Empresa" 
                        name="companyName" 
                        value={formData.companyName} 
                        onChange={handleChange} 
                        placeholder="Ex: Hotel Aurora"
                    />
                    <Input 
                        label="Indústria / Nicho" 
                        name="industry" 
                        value={formData.industry} 
                        onChange={handleChange}
                        placeholder="Ex: Hotelaria Boutique de Luxo"
                    />
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Comunicação</h3>
                <Input 
                    label="Público Alvo" 
                    name="targetAudience" 
                    value={formData.targetAudience} 
                    onChange={handleChange}
                    placeholder="Ex: Casais jovens, 25-40 anos, alta renda, buscam experiências exclusivas."
                />
                <TextArea 
                    label="Tom de Voz (Tone of Voice)" 
                    name="toneOfVoice" 
                    value={formData.toneOfVoice} 
                    onChange={handleChange}
                    rows={4}
                    placeholder="Ex: Sofisticado, acolhedor, prestativo e ligeiramente informal. Evite jargões corporativos."
                />
            </div>

            <div className="pt-4 flex justify-end">
                <Button onClick={handleSave} isLoading={isSaving} icon={Save}>
                    Salvar DNA
                </Button>
            </div>

        </div>

      </div>
    </div>
  );
};