import { StepType, TourProvider } from '@reactour/tour';
import { forceUploadModeChange } from '../../form/useUploadMode';
import { useState } from 'react';
import { forceUploadStateChange } from '../../sidebar/useSidebarState';

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
      actionAfter: () => forceUploadModeChange('file')
    },
    {
      selector: '[data-tour="file-input"]',
      content: 'Clique aqui para selecionar um arquivo PDF ou TXT do seu computador.',
      action: (el) => { if (!el) setCurrentStep(1); }
    },
    {
      selector: '[data-tour="text-input-toggle"]',
      content: 'Ou, se preferir, pode colar o texto do e-mail diretamente aqui para análise.',
      actionAfter: () => forceUploadModeChange('text')
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
      selector: '[data-tour="sidebar-toggle-button"]',
      content: 'Os resultados da classificação aparecerão na barra lateral. Clique neste botão para abri-la e ver o histórico de classificações.',
      action: (el) => {
        const style = window.getComputedStyle(el as HTMLElement);
        if (style.display === 'none') setCurrentStep(7);
      },
      actionAfter: () => forceUploadStateChange(true)
    },
    {
      selector: '[data-tour="sidebar-results"]',
      content: 'Aqui estão os resultados das classificações anteriores. Você pode clicar em cada resultado para ver mais detalhes.',
    },
  ];

  const beforeClose = () => {
    forceUploadModeChange('file');
    forceUploadStateChange(false);
  };

  return (
    <TourProvider
      steps={steps}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      beforeClose={beforeClose}
    >
      {children}
    </TourProvider>
  );
}

export default Tour;
