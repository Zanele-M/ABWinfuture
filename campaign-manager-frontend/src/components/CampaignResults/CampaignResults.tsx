import React, { useEffect, useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import ABTestService from '../../services/api';
import { CampaignResultResponse } from '../../services/types';

const CampaignResults: React.FC = () => {
  const [resultData, setResultData] = useState<CampaignResultResponse[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await ABTestService.getAllCampaignResults();
        if (Array.isArray(response)) {
          setResultData(response);
        } else {
          setResultData([response]);
        }
      } catch (error) {
        console.error('Error fetching campaign results:', error);
      }
    };

    fetchResults();
    const interval = setInterval(fetchResults, 15000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) {
      return '-';
    }
  
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = Math.floor(seconds % 60);
  
    let timeString = `${secs} seconds`;
    if (days > 0) timeString = `${days} days ${hours} hours ${minutes} minutes ${secs} seconds`;
    else if (hours > 0) timeString = `${hours} hours ${minutes} minutes ${secs} seconds`;
    else if (minutes > 0) timeString = `${minutes} minutes ${secs} seconds`;
  
    return timeString;
  };
  
  

  const pauseCampaign = async (campaignId: number) => {
    try {
      await ABTestService.pauseCampaign(campaignId);
      console.log(`Campaign ${campaignId} paused successfully.`);
    } catch (error) {
      console.error(`Error pausing campaign ${campaignId}:`, error);
    }
  };

  const resumeCampaign = async (campaignId: number) => {
    try {
      await ABTestService.resumeCampaign(campaignId);
      console.log(`Campaign ${campaignId} resumed successfully.`);
    } catch (error) {
      console.error(`Error resuming campaign ${campaignId}:`, error);
    }
  };

  const renderMetricsTable = (result: CampaignResultResponse) => {
    return (
      <div style={{ marginBottom: '20px' }} key={result.campaign_id}>
        <div style={{ border: '2px solid black', padding: '10px' }}>
          <Typography variant="h6">Campaign Name: {result.campaign_name}</Typography>
          <Typography variant="body1">Date Created: {result.date_created}</Typography>
          <Typography variant="body1">Confidence Interval: {result.confidence_interval}</Typography>
          <Typography variant="body1">Winner: {result.winner}</Typography>
          <Typography variant="body1">Analysis Time: {formatTime(result.analysis_time)}</Typography>
          <Typography variant="body1">Status: {result.status}</Typography>
          {result.status !== 'Paused' ? (
            <Button variant="contained" color="secondary" onClick={() => pauseCampaign(result.campaign_id)}>
              Pause Campaign
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={() => resumeCampaign(result.campaign_id)}>
              Resume Campaign
            </Button>
          )}
        </div>
        <Typography variant="h6">Control:</Typography>
        <Table style={{ marginBottom: '20px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Total Views</TableCell>
              <TableCell>Total Clicks</TableCell>
              <TableCell>Click Through Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{result.control.name}</TableCell>
              <TableCell>{result.control.total_views}</TableCell>
              <TableCell>{result.control.total_clicks}</TableCell>
              <TableCell>{result.control.ctr.toPrecision(2)}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Typography variant="h6">Variants:</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Total Views</TableCell>
              <TableCell>Total Clicks</TableCell>
              <TableCell>Click Through Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.variants.map((variant, index) => (
              <TableRow key={index}>
                <TableCell>{variant.name}</TableCell>
                <TableCell>{variant.total_views}</TableCell>
                <TableCell>{variant.total_clicks}</TableCell>
                <TableCell>{variant.ctr.toPrecision(2)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  

  return (
    <div>
      <Typography variant="h4">Campaign Results</Typography>
      {resultData.length > 0 ? (
        <div>
          <Typography variant="h5" style={{ marginTop: '20px' }}>Results:</Typography>
          {resultData.map(result => renderMetricsTable(result))}
        </div>
      ) : (
        <Typography variant="h5" style={{ marginTop: '20px' }}>No campaign results to display.</Typography>
      )}
    </div>
  );
}

export default CampaignResults;
