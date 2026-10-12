import Input from '@/components/inputs/Input';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRecords } from '@/providers/CreateRecordProvider';
import { RecordPayload, RecordFileItems, UploadedItems } from '@/types/recordType';
import { get } from 'http';



function InformationFormulaire() {
    const { payload, setPayload, setBeneficiary } = useRecords();
    const fileAttestation = (payload?.items as RecordFileItems)?.file_attestation;
    const fileFacture = (payload?.items as RecordFileItems)?.file_facture;
    const fileDevis = (payload?.items as RecordFileItems)?.file_devis;
    // Define state variables for each input field
    const getValueByVariableName = (variableKey: string): string => {
      const findIn = (
        array: UploadedItems | null | undefined,
        key: string,
        field: 'facture' | 'devis' | 'attestation'
      ): string | null => {
        if (!Array.isArray(array)) return null;

        const found = array.find(item => item?.variables === key);
        const value = found?.[field];

        return value !== null && value !== undefined && value !== '' ? String(value) : null;
      };

      return (
        findIn(fileFacture, variableKey, 'facture') ??
        findIn(fileDevis, variableKey, 'devis') ??
        findIn(fileAttestation, variableKey, 'attestation') ??
        ''
      );
    };

   
    const [companyName, setCompanyName] = useState(
      getValueByVariableName("beneficiaire_raison_sociale") || ''
    );
    const [name, setName] = useState(
     getValueByVariableName("beneficiaire_nom_prenom") || ''
    );
    const [workAddress, setWorkAddress] = useState(
      getValueByVariableName("adresse_travaux") || ''
    );
    const [siret, setSiret] = useState(
      getValueByVariableName("beneficiaire_numero_siret") || ''
      
    );
    const [workPostalCode, setWorkPostalCode] = useState(
      getValueByVariableName("adresse_travaux") || ''
    );
    const [workCity, setWorkCity] = useState(
      getValueByVariableName("adresse_travaux") || ''
    );
    const rawDateOfQuoteSignature = getValueByVariableName("date_signature") || '';
    const [day, month, year] = (
      rawDateOfQuoteSignature.split('/').map(Number).concat([1, 1, 1970]).slice(0, 3)
    ) as [number, number, number];
    const [dateOfQuoteSignature, setDateOfQuoteSignature] = useState(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
    
    const rawDateOfHonorSignature = getValueByVariableName("date_signature_beneficiaire") || '';
    const [dayHonor, monthHonor, yearHonor] = (
      rawDateOfHonorSignature.split('/').map(Number).concat([1, 1, 1970]).slice(0, 3)
    ) as [number, number, number];
    const [dateOfHonorStatementSignature, setDateOfHonorStatementSignature] = useState(`${yearHonor}-${monthHonor.toString().padStart(2, '0')}-${dayHonor.toString().padStart(2, '0')}`);

    const [address, setAddress] = useState(
      getValueByVariableName("beneficiaire_adresse") || ''
    );
    const [postalCode, setPostalCode] = useState(
      getValueByVariableName("beneficiaire_adresse") || ''
    );
    const [city, setCity] = useState(
      getValueByVariableName("beneficiaire_adresse") || ''
    );
    const [quantityLength, setQuantityLength] = useState(
      getValueByVariableName("quantite") || ''
    );
    const [brand, setBrand] = useState(
      getValueByVariableName("marque") || ''
    );
    const [reference, setReference] = useState(
      getValueByVariableName("referenciel") || ''
    );

    useEffect(() => {
      setPayload(prev => ({
        ...prev,
        name: name,
        company_name: companyName,
        work_address: workAddress,
        siret: siret,
        work_postal_code: workPostalCode,
        work_city: workCity,
        date_of_quote_signature: dateOfQuoteSignature,
        date_of_honor_statement_signature: dateOfHonorStatementSignature,
        address: address,
        postal_code: postalCode,
        city: city,
        quantity_length: Number(quantityLength),
        brand: brand,
        reference: reference,        
    }));
    },[payload.items])

    const rawDateOfInvoiceSignature = Array.isArray(fileFacture) ? String(fileFacture[31]?.facture || '') : '';
    const [dayInvoice, monthInvoice, yearInvoice] = (
      rawDateOfInvoiceSignature.split('/').map(Number).concat([1, 1, 1970]).slice(0, 3)
    ) as [number, number, number];
    const [dateOfInvoiceIssue, setDateOfInvoiceIssue] = useState(`${yearInvoice}-${monthInvoice.toString().padStart(2, '0')}-${dayInvoice .toString().padStart(2, '0')}`);
    
    const handleChangeInput = (value: string | number, key: keyof RecordPayload ) => {
        setPayload((prev) => ({
            ...prev,
            [key]: value
        }))
    }

    function parseAdresse(adresse: string, setCodePostal: Dispatch<SetStateAction<string>>, setCommune: Dispatch<SetStateAction<string>>) {
      if (!adresse || typeof adresse !== 'string') {
        return { code_postal: '', commune: '' };
      }

      // Manadio ny loto manodidina
      const adresseClean = adresse.trim();
      
      // Regex hakana anle code misy isa anaky dimy
      const regexCodePostal = /\b(\d{5})\b/;
      const matchCodePostal = adresseClean.match(regexCodePostal);
      
      if (!matchCodePostal) {
        return { code_postal: '', commune: '' };
      }
      
      const codePostal = matchCodePostal[1];
      const indexCodePostal = adresseClean.indexOf(codePostal);
      
      // manala anle commune aorianle CP
      const apresCodePostal = adresseClean.substring(indexCodePostal + 5).trim();
      setCodePostal(codePostal);
      setCommune(apresCodePostal);
    }


    useEffect(() => {
      parseAdresse(workAddress, setWorkPostalCode, setWorkCity);
      parseAdresse(address, setPostalCode, setCity);
    }, [workAddress, address]);

    useEffect(() => {
      
      if (name!='') {
        setBeneficiary(true);
      }else{
        setBeneficiary(false);
      }
    }, [name])

    return (
        <div className="self-stretch grow px-[30px] flex-col justify-start items-start gap-[30px] flex">
            <div className="h-[495px] overflow-scroll py-[20px] px-[30px] flex-col justify-start items-start gap-[30px] inline-flex grow self-stretch">
                <div className="self-stretch justify-start items-start gap-5 inline-flex">
                    <Input
                        label='Bénéficiaire'
                        isRequired
                      onChange={(value) => {
                        setName(value);
                        handleChangeInput(value, "name");
                        handleChangeInput(`${value}`, "name");
                      }}
                      value={name}
                    />
                    <Input
                      label="SIRET"
                      onChange={(value) => {
                        setSiret(value);
                        handleChangeInput(value, "siret");
                      }}
                      value={siret}
                    />
                </div>
                <div className="self-stretch justify-start items-start gap-5 inline-flex">

                    <Input
                        label='Adresse travaux'
                        onChange={(value) => {
                            setWorkAddress(value);
                            handleChangeInput(value, "work_address");
                        }}
                        value={workAddress}
                    />
                    <Input
                        label='Code  postal travaux'
                        onChange={(value) => {
                            setWorkPostalCode(value);
                            handleChangeInput(value, "work_postal_code");
                        }}
                        value={workPostalCode}
                    />
                    <Input
                        label='Commune travaux'
                        onChange={(value) => {
                            setWorkCity(value);
                            handleChangeInput(value, "work_city");
                        }}
                        value={workCity}
                    />

                </div>
                <div className="self-stretch justify-start items-start gap-5 inline-flex">

                    <Input
                        label='Adresse'
                        onChange={(value) => {
                            setAddress(value);
                            handleChangeInput(value, "address");
                        }}
                        value={address}
                    />
                    <Input
                        label='Code postal'
                        onChange={(value) => {
                            setPostalCode(value);
                            handleChangeInput(value, "postal_code");
                        }}
                        value={postalCode}
                    />
                    <Input
                        label='Commune'
                        onChange={(value) => {
                            setCity(value);
                            handleChangeInput(value, "city");
                        }}
                        value={city}
                    />

                </div>
                <div className="self-stretch justify-start items-start gap-5 inline-flex">
                    <Input
                        label='Quantité/longueur'
                        onChange={(value) => {
                            setQuantityLength(value);
                            handleChangeInput(Number(value), "quantity_length");
                        }}
                        value={quantityLength.toString()}
                    />
                </div>
                <div className="self-stretch justify-start items-start gap-5 inline-flex">
                    <Input
                        label='Marque'
                        onChange={(value) => {
                            setBrand(value);
                            handleChangeInput(value, "brand");
                        }}
                        value={brand}
                    />
                    <Input
                        label='Référence'
                        onChange={(value) => {
                            setReference(value);
                            handleChangeInput(value, "reference");
                        }}
                        value={reference}
                    />
                </div>
                <div className="self-stretch justify-start items-start gap-5 inline-flex">
                    <Input
                        label='Date de signature du devis'
                        onChange={(value) => {
                            setDateOfQuoteSignature(value);
                            handleChangeInput(value, "date_of_quote_signature");
                        }}
                        value={dateOfQuoteSignature}
                        type='date'
                    />
                    <Input
                        label="Date d'émission de la facture"
                        onChange={(value) => {
                            setDateOfInvoiceIssue(value);
                            handleChangeInput(value, "date_of_invoice_issue");
                        }}
                        value={dateOfInvoiceIssue}
                        type='date'
                    />
                    <Input
                        label="Date de signature de l'attestation sur l'honneur"
                        onChange={(value) => {
                            setDateOfHonorStatementSignature(value);
                            handleChangeInput(value, "date_of_honor_statement_signature");
                        }}
                        value={dateOfHonorStatementSignature}
                        type='date'
                    />
                </div>
            </div>
        </div>
    )
}

export default InformationFormulaire;