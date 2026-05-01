import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PollOption {
  id: string;
  optionText: string;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  options: PollOption[];
}

export interface CreatePollRequest {
  title: string;
  description: string;
  options: string[];
}

export interface UpdatePollRequest {
  title?: string;
  description?: string;
  status?: 'active' | 'closed';
}

@Injectable({
  providedIn: 'root',
})
export class PollService {
  private apiUrl = 'http://localhost:3000/api/polls';

  constructor(private http: HttpClient) {}

  createPoll(request: CreatePollRequest): Observable<Poll> {
    return this.http.post<Poll>(this.apiUrl, request);
  }

  getAllPolls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(this.apiUrl);
  }

  getActivePolls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(`${this.apiUrl}/active`);
  }

  getPollById(pollId: string): Observable<Poll> {
    return this.http.get<Poll>(`${this.apiUrl}/${pollId}`);
  }

  updatePoll(pollId: string, request: UpdatePollRequest): Observable<Poll> {
    return this.http.patch<Poll>(`${this.apiUrl}/${pollId}`, request);
  }

  deletePoll(pollId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${pollId}`);
  }

  closePoll(pollId: string): Observable<Poll> {
    return this.http.patch<Poll>(`${this.apiUrl}/${pollId}/close`, {});
  }
}
