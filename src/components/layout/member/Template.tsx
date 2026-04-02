import NavigationHeader from './NavigationHeader';

interface TemplateProps {
  content: React.ReactNode;
  wizardMode?: boolean;
  saveAndExit?: () => void;
  saveAndExitDisabled?: boolean;
}

export const Template = (props: TemplateProps) => {
  return (
    <div className="h-screen flex flex-col bg-slate-50">

      {/* HEADER */}
      <NavigationHeader
        showLogo={true}
        wizardMode={props.wizardMode ?? false}
        saveAndExit={props.saveAndExit}
        saveAndExitDisabled={props.saveAndExitDisabled ?? false}
      />

      {/* CONTENT */}
      <main className="flex-1 overflow-auto p-4 md:p-6">
        {props.content}
      </main>

    </div>
  );
};