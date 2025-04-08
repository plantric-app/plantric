import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { Add, Delete, Save } from '@mui/icons-material';

interface User {
  id: string;
  name: string;
  role: string;
}

interface Member {
  userId: string;
  role: string;
}

const initialMember: Member = { userId: '', role: '' };

interface Props {
  users?: User[];
}

const CreateProject: React.FC<Props> = ({ users = [] }) => {
  const [project, setProject] = useState({
    name: '',
    domain: '',
    desc: '',
    tech_stack: '',
    dev_methods: '',
    surveyMethod: [] as string[],
    nonFunctional: '',
    functional: '',
    milestone: '',
    additional_instruction: '',
    start_date: '',
    end_date: '',
  });

  const [stakeholders, setStakeholders] = useState<Member[]>([initialMember]);
  const [teams, setTeams] = useState<Member[]>([initialMember]);
  const [dateError, setDateError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<any>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: typeof value === 'string' ? value.split(',') : value }));
  };

  const handleMemberChange = (type: 'stakeholder' | 'team', index: number, field: keyof Member, value: string) => {
    const list = type === 'stakeholder' ? [...stakeholders] : [...teams];
    if (field === 'userId') {
      const selectedUser = users.find(user => user.id === value);
      list[index].role = selectedUser?.role || '';
    }
    list[index][field] = value;
    type === 'stakeholder' ? setStakeholders(list) : setTeams(list);
  };

  const addMember = (type: 'stakeholder' | 'team') => {
    type === 'stakeholder'
      ? setStakeholders([...stakeholders, { ...initialMember }])
      : setTeams([...teams, { ...initialMember }]);
  };

  const removeMember = (type: 'stakeholder' | 'team', index: number) => {
    const updated = (type === 'stakeholder' ? stakeholders : teams).filter((_, i) => i !== index);
    type === 'stakeholder' ? setStakeholders(updated) : setTeams(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (project.start_date && project.end_date && project.end_date < project.start_date) {
      setDateError('End Date must be after Start Date.');
      return;
    }
    setDateError(null);
    const payload = { ...project, stakeholders, teams };
    console.log('Form Submitted:', payload);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Create Project</Typography>

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6">Project Info</Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth name="name" label="Project Name" value={project.name} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Domain</InputLabel>
                <Select name="domain" value={project.domain} label="Domain" onChange={handleSelectChange}>
                  {['Healthcare', 'Educational', 'Social Networking'].map(d => (
                    <MenuItem value={d} key={d}>{d}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth name="desc" label="Project Description" value={project.desc} onChange={handleInputChange} multiline rows={3} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth name="tech_stack" label="Tech Stack" value={project.tech_stack} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Development Method</InputLabel>
                <Select name="dev_methods" value={project.dev_methods} label="Development Method" onChange={handleSelectChange}>
                  {['Agile', 'Scrum', 'Waterfall', 'DevOps'].map(m => <MenuItem value={m} key={m}>{m}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Survey Methods</InputLabel>
                <Select name="surveyMethod" multiple value={project.surveyMethod} onChange={handleSelectChange}>
                  {['Interviews', 'Workshops', 'Surveys', 'Observation'].map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth name="nonFunctional" label="Non-Functional Requirements" value={project.nonFunctional} onChange={handleInputChange} multiline rows={2} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth name="functional" label="Functional Requirements" value={project.functional} onChange={handleInputChange} multiline rows={2} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth name="start_date" label="Start Date" type="date"
                InputLabelProps={{ shrink: true }} value={project.start_date}
                onChange={handleInputChange} error={!!dateError}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth name="end_date" label="End Date" type="date"
                InputLabelProps={{ shrink: true }} value={project.end_date}
                onChange={handleInputChange} error={!!dateError}
                helperText={dateError || ''}
              />
            </Grid>
            {dateError && (
              <Grid item xs={12}>
                <Alert severity="error">{dateError}</Alert>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {[{ label: 'Stakeholders', type: 'stakeholder', data: stakeholders }, { label: 'Team Members', type: 'team', data: teams }].map(({ label, type, data }) => (
        <Card sx={{ mb: 4, boxShadow: 2 }} key={type}>
          <CardContent>
            <Typography variant="h6">{label}</Typography>
            <Divider sx={{ my: 2 }} />
            {data.map((member, index) => (
              <Grid container spacing={2} key={`${type}-${index}`} sx={{ mb: 1 }}>
                <Grid item xs={12} md={5}>
                  <FormControl fullWidth>
                    <InputLabel>{label === 'Stakeholders' ? 'Stakeholder' : 'Team Member'}</InputLabel>
                    <Select
                      value={member.userId}
                      onChange={(e) => handleMemberChange(type as 'stakeholder' | 'team', index, 'userId', e.target.value)}
                    >
                      {users.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField fullWidth label="Role" value={member.role} disabled />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button fullWidth color="error" startIcon={<Delete />} onClick={() => removeMember(type as 'stakeholder' | 'team', index)}>
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Button variant="outlined" startIcon={<Add />} onClick={() => addMember(type as 'stakeholder' | 'team')}>
              Add {label === 'Stakeholders' ? 'Stakeholder' : 'Team Member'}
            </Button>
          </CardContent>
        </Card>
      ))}

      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6">Project Plan</Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth name="milestone" label="Project Milestones" value={project.milestone} onChange={handleInputChange} multiline rows={2} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth name="additional_instruction" label="Additional Instructions" value={project.additional_instruction} onChange={handleInputChange} multiline rows={2} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Button type="submit" variant="contained" size="large" startIcon={<Save />}>
        Save Project
      </Button>
    </Box>
  );
};

export default CreateProject;
