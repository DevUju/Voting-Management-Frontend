import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateVoteRequest {
  pollId: string;
  optionId: string;
}

export interface Vote {
  id: string;
  userId: string;
  pollId: string;
  optionId: string;
  state: string;
  createdAt: Date;
}

export interface VoteResult {
  optionId: string;
  optionText: string;
  totalVotes: number;
  stateBreakdown: {
    [state: string]: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class VoteService {
  private apiUrl = 'http://localhost:3000/api/votes';

  constructor(private http: HttpClient) {}

  createVote(request: CreateVoteRequest): Observable<Vote> {
    return this.http.post<Vote>(this.apiUrl, request);
  }

  getVotesByPoll(pollId: string): Observable<Vote[]> {
    return this.http.get<Vote[]>(`${this.apiUrl}/poll/${pollId}`);
  }

  getPollResults(pollId: string): Observable<VoteResult[]> {
    return this.http.get<VoteResult[]>(`${this.apiUrl}/poll/${pollId}/results`);
  }

  getPollResultsByState(pollId: string, state: string): Observable<VoteResult[]> {
    return this.http.get<VoteResult[]>(`${this.apiUrl}/poll/${pollId}/results/by-state?state=${state}`);
  }

  getUserVoteOnPoll(userId: string, pollId: string): Observable<Vote | null> {
    return this.http.get<Vote | null>(`${this.apiUrl}/user/${userId}/poll/${pollId}`);
  }
}
