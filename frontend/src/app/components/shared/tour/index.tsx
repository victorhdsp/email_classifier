import { StepType, TourProvider } from '@reactour/tour';
import { forceUploadModeChange } from '../../form/useUploadMode';
import { useState } from 'react';

interface TourProps {
  children: React.ReactNode;
}

function Tour({ children }: TourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: StepType[] = [
    {
      selector: '[data-tour="email-form"]',
      content: 'Bem-vindo ao classificador de e-mails! Este é o formulário principal onde você pode enviar e-mails para análise.',
    },
    {
      selector: '[data-tour="file-upload-toggle"]',
      content: 'Você pode enviar um arquivo de e-mail nos formatos PDF ou TXT para classificação.',
      action: () => forceUploadModeChange('file')
    },
    {
      selector: '[data-tour="file-input"]',
      content: 'Clique aqui para selecionar um arquivo PDF ou TXT do seu computador.',
      action: (el) => { if (!el) setCurrentStep(1); }
    },
    {
      selector: '[data-tour="text-input-toggle"]',
      content: 'Ou, se preferir, pode colar o texto do e-mail diretamente aqui para análise.',
      action: () => forceUploadModeChange('text')
    }, 
    {
      selector: '[data-tour="text-input"]',
      content: 'Cole o conteúdo do e-mail nesta caixa de texto para que ele seja classificado.',
      action: (el) => { if (!el) setCurrentStep(3); }
    },
    {
      selector: '[data-tour="submit-button"]',
      content: 'Depois de inserir o e-mail (via arquivo ou texto), clique neste botão para enviá-lo para classificação.',
    },
    {
      selector: '[data-testid="sidebar-toggle-button"]',
      content: 'Os resultados da classificação aparecerão na barra lateral. Clique neste botão para abri-la e ver o histórico de classificações.',
    },
  ];

  return (
    <TourProvider
      steps={steps}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
    >
      {children}
    </TourProvider>
  );
}

export default Tour;
