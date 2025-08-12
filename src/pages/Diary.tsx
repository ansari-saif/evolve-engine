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
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Diary</h1>
        <div className="grid gap-3 sm:gap-4">
          <SkeletonLoader count={3} className="h-24 sm:h-32" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Diary</h1>
        <ErrorMessage message="Failed to load diary entries. Please try again." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Diary</h1>

      {/* Create Diary Entry Form */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-sm sm:text-base lg:text-lg">Write Today's Entry</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="space-y-3 sm:space-y-4">
            <Input
              placeholder="Entry title (optional)"
              value={newLogTitle}
              onChange={(e) => setNewLogTitle(e.target.value)}
              className="text-xs sm:text-sm"
            />
            <Textarea
              placeholder="What happened today? How are you feeling?"
              value={newLogContent}
              onChange={(e) => setNewLogContent(e.target.value)}
              rows={3}
              className="text-xs sm:text-sm"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                placeholder="Mood (optional)"
                value={newLogMood}
                onChange={(e) => setNewLogMood(e.target.value)}
                className="text-xs sm:text-sm"
              />
              <Input
                placeholder="Location (optional)"
                value={newLogLocation}
                onChange={(e) => setNewLogLocation(e.target.value)}
                className="text-xs sm:text-sm"
              />
            </div>
            <Button
              onClick={handleCreateDayLog}
              disabled={createDayLogMutation.isPending || !newLogContent.trim()}
              className="w-full text-xs sm:text-sm py-2 sm:py-3 min-h-[36px]"
            >
              {createDayLogMutation.isPending ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                'Save Entry'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Diary Entries List */}
      <div className="grid gap-3 sm:gap-4">
        {dayLogs && dayLogs.length > 0 ? (
          dayLogs.map((log: DayLogResponse) => (
            <Card key={log.log_id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold">
                        {log.summary ? log.summary.substring(0, 50) + '...' : 'Untitled Entry'}
                      </h3>
                      <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0.5 w-fit">
                        {new Date(log.date).toLocaleDateString()}
                      </Badge>
                    </div>
                    {log.location && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">
                        📍 {log.location}
                      </p>
                    )}
                    {log.weather && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">
                        🌤️ {log.weather}
                      </p>
                    )}
                    <div className="space-y-2 sm:space-y-3">
                      {log.highlights && (
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-green-600">Highlights:</p>
                          <p className="text-xs sm:text-sm text-gray-700">{log.highlights}</p>
                        </div>
                      )}
                      {log.challenges && (
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-orange-600">Challenges:</p>
                          <p className="text-xs sm:text-sm text-gray-700">{log.challenges}</p>
                        </div>
                      )}
                      {log.learnings && (
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-blue-600">Learnings:</p>
                          <p className="text-xs sm:text-sm text-gray-700">{log.learnings}</p>
                        </div>
                      )}
                      {log.gratitude && (
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-purple-600">Gratitude:</p>
                          <p className="text-xs sm:text-sm text-gray-700">{log.gratitude}</p>
                        </div>
                      )}
                      {log.tomorrow_plan && (
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-indigo-600">Tomorrow's Plan:</p>
                          <p className="text-xs sm:text-sm text-gray-700">{log.tomorrow_plan}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-6 sm:py-8">
            <p className="text-xs sm:text-sm text-gray-500">No diary entries found. Write your first entry above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diary;