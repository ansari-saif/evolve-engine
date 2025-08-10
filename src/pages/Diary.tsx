import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { LoadingSpinner, SkeletonLoader, ErrorMessage } from '../components/ui';
import { useGetUserDayLogs, useCreateDayLog } from '../hooks/useDayLogs';
import { useUserId } from '../contexts/AppContext';
import type { DayLogResponse } from '../client/models';

const Diary: React.FC = () => {
  const [newLogTitle, setNewLogTitle] = useState('');
  const [newLogContent, setNewLogContent] = useState('');
  const [newLogMood, setNewLogMood] = useState('');
  const [newLogLocation, setNewLogLocation] = useState('');

  const userId = useUserId();

  const { data: dayLogs, isLoading, error } = useGetUserDayLogs(userId);
  const createDayLogMutation = useCreateDayLog();

  const handleCreateDayLog = async () => {
    if (!newLogContent.trim()) return;

    try {
      await createDayLogMutation.mutateAsync({
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        start_time: new Date().toISOString(),
        summary: newLogContent,
        user_id: userId,
        location: newLogLocation || undefined,
        weather: undefined, // Could be added later
      });

      setNewLogTitle('');
      setNewLogContent('');
      setNewLogMood('');
      setNewLogLocation('');
    } catch (error) {
      console.error('Failed to create day log:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Diary</h1>
        <div className="grid gap-4">
          <SkeletonLoader count={3} className="h-32" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Diary</h1>
        <ErrorMessage message="Failed to load diary entries. Please try again." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Diary</h1>

      {/* Create Diary Entry Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Write Today's Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Entry title (optional)"
              value={newLogTitle}
              onChange={(e) => setNewLogTitle(e.target.value)}
            />
            <Textarea
              placeholder="What happened today? How are you feeling?"
              value={newLogContent}
              onChange={(e) => setNewLogContent(e.target.value)}
              rows={4}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Mood (optional)"
                value={newLogMood}
                onChange={(e) => setNewLogMood(e.target.value)}
              />
              <Input
                placeholder="Location (optional)"
                value={newLogLocation}
                onChange={(e) => setNewLogLocation(e.target.value)}
              />
            </div>
            <Button
              onClick={handleCreateDayLog}
              disabled={createDayLogMutation.isPending || !newLogContent.trim()}
              className="w-full"
            >
              {createDayLogMutation.isPending ? <LoadingSpinner size="small" /> : 'Save Entry'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Diary Entries List */}
      <div className="grid gap-4">
        {dayLogs && dayLogs.length > 0 ? (
          dayLogs.map((log: DayLogResponse) => (
            <Card key={log.log_id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">
                        {log.summary ? log.summary.substring(0, 50) + '...' : 'Untitled Entry'}
                      </h3>
                      <Badge variant="outline">
                        {new Date(log.date).toLocaleDateString()}
                      </Badge>
                    </div>
                    {log.location && (
                      <p className="text-sm text-gray-600 mb-2">
                        📍 {log.location}
                      </p>
                    )}
                    {log.weather && (
                      <p className="text-sm text-gray-600 mb-2">
                        🌤️ {log.weather}
                      </p>
                    )}
                    <div className="space-y-2">
                      {log.highlights && (
                        <div>
                          <p className="text-sm font-medium text-green-600">Highlights:</p>
                          <p className="text-sm text-gray-700">{log.highlights}</p>
                        </div>
                      )}
                      {log.challenges && (
                        <div>
                          <p className="text-sm font-medium text-orange-600">Challenges:</p>
                          <p className="text-sm text-gray-700">{log.challenges}</p>
                        </div>
                      )}
                      {log.learnings && (
                        <div>
                          <p className="text-sm font-medium text-blue-600">Learnings:</p>
                          <p className="text-sm text-gray-700">{log.learnings}</p>
                        </div>
                      )}
                      {log.gratitude && (
                        <div>
                          <p className="text-sm font-medium text-purple-600">Gratitude:</p>
                          <p className="text-sm text-gray-700">{log.gratitude}</p>
                        </div>
                      )}
                      {log.tomorrow_plan && (
                        <div>
                          <p className="text-sm font-medium text-indigo-600">Tomorrow's Plan:</p>
                          <p className="text-sm text-gray-700">{log.tomorrow_plan}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No diary entries found. Write your first entry above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diary;