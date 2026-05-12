import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

export interface PollOption {
  id: string;
  optionText: string;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  status: "active" | "closed";
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
  status?: "active" | "closed";
  options?: { id: string; optionText: string }[];
}

@Injectable({
  providedIn: "root",
})
export class PollService {
  private apiUrl = `${environment.apiUrl}/polls`;

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

  reopenPoll(pollId: string) {
    return this.http.post(`${this.apiUrl}/${pollId}/reopen`, {});
  }

  deletePoll(pollId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${pollId}`);
  }

  closePoll(pollId: string): Observable<Poll> {
    return this.http.patch<Poll>(`${this.apiUrl}/${pollId}/close`, {});
  }
}
