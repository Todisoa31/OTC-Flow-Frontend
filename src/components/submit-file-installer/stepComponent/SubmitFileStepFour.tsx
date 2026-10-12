
import SingleDossierInformation from '../SingleDossierInformation';

type Props = Readonly<{ 
  typeDossier: string;
  
}>;

function SubmitFileStepFour(props: Props) {
    const {typeDossier} = props;
    
    if(typeDossier === 'one_folder'){
      return(
        <SingleDossierInformation />
      )
    }

    return(
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Informations</h2>
        <p className="text-gray-600">Dossier crée avec succées</p>
      </div>
    );
    
}

export default SubmitFileStepFour