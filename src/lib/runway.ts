export interface RunwayAvatarVideoRequest {
  model: string;
  avatar: {
    type: string;
    avatarId: string;
  };
  speech: {
    type: string;
    text: string;
  };
}

export interface RunwayTaskResponse {
  id: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
  createdAt?: string;
  output?: string[];
  failure?: string;
  failureCode?: string;
}

const RUNWAY_API_URL = 'https://api.dev.runwayml.com/v1';

export async function startAvatarVideo(customScript: string): Promise<string> {
  const apiKey = process.env.RUNWAYML_API_KEY;
  if (!apiKey) {
    throw new Error('RUNWAYML_API_KEY is not set');
  }

  // The specific avatar ID provided by the user
  const avatarId = 'f111a172-1b5f-4df1-870f-09e87c593792';

  const requestBody: RunwayAvatarVideoRequest = {
    model: 'gwm1_avatars',
    avatar: {
      type: 'custom',
      avatarId: avatarId,
    },
    speech: {
      type: 'text',
      text: customScript,
    },
  };

  const response = await fetch(`${RUNWAY_API_URL}/avatar_videos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'X-Runway-Version': '2024-11-06',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to start RunwayML task: ${response.status} ${errorText}`);
  }

  const data = await response.json() as RunwayTaskResponse;
  return data.id;
}

export async function checkAvatarVideoTask(taskId: string): Promise<RunwayTaskResponse> {
  const apiKey = process.env.RUNWAYML_API_KEY;
  if (!apiKey) {
    throw new Error('RUNWAYML_API_KEY is not set');
  }

  const response = await fetch(`${RUNWAY_API_URL}/tasks/${taskId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'X-Runway-Version': '2024-11-06',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to check RunwayML task status: ${response.status} ${errorText}`);
  }

  const data = await response.json() as RunwayTaskResponse;
  return data;
}
