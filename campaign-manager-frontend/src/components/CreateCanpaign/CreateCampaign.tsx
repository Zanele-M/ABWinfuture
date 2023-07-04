import React, { useState, useEffect } from 'react';
import ABTestService from '../../services/api';
import { styled } from '@mui/material/styles';
import { Button, TextField, Container, Box, Typography } from "@mui/material";
import { Add, Delete } from '@mui/icons-material';

const FormContainer = styled('form')({
  '& .MuiTextField-root': {
    margin: '8px',
    width: '25ch',
  },
});

const VariantName = styled(Typography)({
  fontSize: '0.875rem',
  color: 'rgba(0, 0, 0, 0.54)', // color similar to TextField label
  marginBottom: '8px', // space between name and identifier
});

const LineInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
      borderBottom: '1px solid rgba(0, 0, 0, 0.42)', // You can adjust color and thickness as you need
    },
    '&:hover fieldset': {
      border: 'none',
      borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
      borderBottom: '2px solid #3f51b5', // Typically a focused input might have a slightly thicker and/or different colored border
    },
  },
});

const CreateCampaign: React.FC<{ setCurrentTab: (tab: string) => void }> = (props) => {
  const { setCurrentTab } = props;
  const [campaignData, setCampaignData] = useState({
    campaign_name : '', 
    contro_name: 'Original',
    control_identifier: '',
    type: '', // initially empty
    variants: [
      {
        name: 'Variant A',
        identifier: '',
      } 
    ]
  });

  const [variantCount, setVariantCount] = useState(1);

  useEffect(() => {
    setCampaignData(prevData => ({
      ...prevData,
      variants: prevData.variants.map((variant, i) => ({
        ...variant,
        name: prevData.type ? `${campaignData.type.charAt(0).toUpperCase() + campaignData.type.slice(1)} ${String.fromCharCode(65 + i)}` : `Alternative Element ${String.fromCharCode(65 + i)}`
      }))
    }));
  }, [variantCount, campaignData.type])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCampaignData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRemoveVariant = (indexToRemove: number) => {
    setCampaignData((prevData) => ({
      ...prevData,
      variants: prevData.variants.filter((_, index) => index !== indexToRemove),
    }));
    setVariantCount(variantCount - 1);
  };

  const handleVariantChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = event.target;
    const updatedVariants = [...campaignData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [name]: value
    };
    setCampaignData((prevData) => ({
      ...prevData,
      variants: updatedVariants
    }));
  };

  const handleAddVariant = () => {
    const newVariant = {
      name: campaignData.type ? `${campaignData.type.charAt(0).toUpperCase() + campaignData.type.slice(1)} ${String.fromCharCode(65 + variantCount)}` : `Alternative Element ${String.fromCharCode(65 + variantCount)}`,
      identifier: '',
    };
    setCampaignData((prevData) => ({
      ...prevData,
      variants: [...prevData.variants, newVariant]
    }));
    setVariantCount(variantCount + 1);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // const elementExists = await ABTestService.checkElementExistence(campaignData.control_identifier, campaignData.type);
      // if(!elementExists) {
      //   throw new Error('Element does not exist on the website');
      // }
      const updatedCampaignData = {
        ...campaignData,
        control_name: 'Original',
        variants: campaignData.variants.map((variant, index) => ({
          ...variant,
          name: `Variant ${String.fromCharCode(65 + index)}`,
        })),
      };
  
      await ABTestService.createCampaign(updatedCampaignData);
      props.setCurrentTab('success');
    } catch (error) {
      props.setCurrentTab('error');
    }
  };

  return (
    <Container maxWidth="sm">
      <FormContainer noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Box mb={3}>
          <Typography variant="h6" component="h2">
            Set Up A New Campaign
          </Typography>
  
          <LineInput
            id="campaign_name"
            label="Campaign Name"
            name="campaign_name"
            value={campaignData.campaign_name}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
          />
  <LineInput
  id="type"
  select
  label="Campaign Type"
  name="type"
  value={campaignData.type}
  onChange={handleInputChange}
  SelectProps={{ native: true }}
  variant="outlined"
  fullWidth
  InputLabelProps={{ shrink: true }}
>
  <option value="">Select</option>
  <option value="headline">Headline</option>
  <option value="image">Image Src</option>
  <option value="custom">Custom</option>
</LineInput>

  
          <LineInput
            id="control_identifier"
            label={campaignData.type === 'headline' ? "Original Headline" : campaignData.type === 'image' ? "Original Image Src" : campaignData.type === 'custom' ? "Original Custom" : "Orignal Element"}
            name="control_identifier"
            value={campaignData.control_identifier}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            required
          />
  
          <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
          {campaignData.type === 'headline' ? "Add Headlines" : campaignData.type === 'image' ? "Add Image Sources" : campaignData.type === 'custom' ? "Add Custom Element" : ""}          </Typography>
  
          {campaignData.variants.map((variant, variantIndex) => (
  <Box key={variantIndex} mb={3}>
    <VariantName variant="body1">
      {variant.name}
    </VariantName>

    <LineInput
      id={`variant-identifier-${variantIndex}`}
      label={campaignData.type === 'headline' ? "Alternative Headline" : campaignData.type === 'image' ? "Alternative Image Src" : "Alternative element"}
      name="identifier"
      value={variant.identifier}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        handleVariantChange(event, variantIndex)
      }
      variant="outlined"
      fullWidth
      required
    />
            
  
            <Delete
  style={{ color: 'red', cursor: 'pointer', marginTop: '16px' }}
  onClick={() => handleRemoveVariant(variantIndex)}
/>

            </Box>
          ))}
  
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddVariant}
            sx={{ mt: 2 }}
          >
            Add Variant
          </Button>
        </Box>
  
        <Button variant="contained" color="primary" type="submit">
          Create Test
        </Button>
      </FormContainer>
    </Container>
  );
};

export default CreateCampaign;
