export const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, setData: any) => {
    const { name, value } = event.target;
    setData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  export const handleVariantChange = (event: React.ChangeEvent<HTMLInputElement>, index: number, campaignData: any, setCampaignData: any) => {
    const { name, value } = event.target;
    const updatedVariants = [...campaignData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [name]: value
    };
    setCampaignData((prevData: any) => ({
      ...prevData,
      variants: updatedVariants
    }));
  };
  
  export const handleAddVariant = (setCampaignData: any, variantName: string) => {
    const newVariant = {
      name: variantName,
      identifier: '',
    };
    setCampaignData((prevData: { variants: any; }) => ({
      ...prevData,
      variants: [...prevData.variants, newVariant]
    }));
  };
  