import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { PollService, Poll } from "../poll.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-admin-panel",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./admin-panel.component.html",
  styleUrls: ["./admin-panel.component.css"],
})
export class AdminPanelComponent implements OnInit {
  createPollForm: FormGroup;
  allPolls: Poll[] = [];
  isCreatingPoll = false;
  isSavingPoll = false;
  isLoadingPolls = true;
  isUpdatingPoll = false;
  isEditMode = false;
  editPollId: string | null = null;
  createErrorMessage = "";
  createSuccessMessage = "";
  editErrorMessage = "";
  editSuccessMessage = "";
  optionsError = "";

  private existingOptionIds: (string | null)[] = [null, null, null, null];

  get title() {
    return this.createPollForm.get("title")!;
  }
  get description() {
    return this.createPollForm.get("description")!;
  }

  constructor(
    private fb: FormBuilder,
    private pollService: PollService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.createPollForm = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      options: this.fb.array([
        this.fb.control("", Validators.required),
        this.fb.control("", Validators.required),
        this.fb.control(""),
        this.fb.control(""),
      ]),
    });
  }

  ngOnInit(): void {
    this.loadPolls();
    this.route.queryParamMap.subscribe((params) => {
      const pollId = params.get("pollId");
      if (pollId) {
        this.loadPollForEdit(pollId);
      }
    });
  }

  getOptionControl(index: number): FormControl {
    const optionsArray = this.createPollForm.get("options") as FormArray;
    return optionsArray.at(index) as FormControl;
  }

  private setOptionControls(options: string[]): void {
    const optionControls = options
      .slice(0, 4)
      .map((option) =>
        this.fb.control(option || "", option ? Validators.required : null),
      );
    while (optionControls.length < 4) {
      optionControls.push(this.fb.control(""));
    }
    this.createPollForm.setControl("options", this.fb.array(optionControls));
  }

  private resetForm(): void {
    this.createPollForm.reset();
    this.setOptionControls(["", "", "", ""]);
    this.existingOptionIds = [null, null, null, null]; // Clear stored IDs
    this.optionsError = "";
    this.createErrorMessage = "";
    this.createSuccessMessage = "";
    this.editErrorMessage = "";
    this.editSuccessMessage = "";
  }

  private loadPollForEdit(pollId: string): void {
    this.isLoadingPolls = true;
    this.pollService.getPollById(pollId).subscribe({
      next: (poll) => {
        console.log("Loaded poll for edit:", poll);
        console.log("Poll options:", poll.options);
        this.enterEditMode(poll);
        this.isLoadingPolls = false;
      },
      error: (err) => {
        console.error("Error loading poll for edit:", err);
        this.isLoadingPolls = false;
      },
    });
  }

  enterEditMode(poll: Poll): void {
    this.isEditMode = true;
    this.editPollId = poll.id;
    this.createErrorMessage = "";
    this.editErrorMessage = "";
    this.createSuccessMessage = "";
    this.editSuccessMessage = "";

    this.existingOptionIds = [null, null, null, null];
    const optionTexts = poll.options.slice(0, 4).map((option, index) => {
      this.existingOptionIds[index] = option.id;
      return option.optionText;
    });

    console.log("Setting option texts:", optionTexts);
    console.log("Stored option IDs:", this.existingOptionIds);
    this.setOptionControls(optionTexts);
    this.createPollForm.patchValue({
      title: poll.title,
      description: poll.description,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editPollId = null;
    this.resetForm();
    this.router.navigate(["/admin"]);
  }

  onBack(): void {
    if (this.isEditMode) {
      this.cancelEdit();
      return;
    }

    this.router.navigate(["/dashboard"]);
  }

  loadPolls(): void {
    this.pollService.getAllPolls().subscribe({
      next: (data) => {
        this.allPolls = data;
        this.isLoadingPolls = false;
      },
      error: () => {
        this.isLoadingPolls = false;
      },
    });
  }

  onCreatePoll(): void {
    if (this.isEditMode) {
      this.onUpdatePoll();
      return;
    }

    if (this.createPollForm.valid) {
      const optionsArray = this.createPollForm.get("options") as FormArray;
      const filteredOptions = (optionsArray.value as string[]).filter(
        (opt: string) => opt.trim(),
      );

      if (filteredOptions.length < 2 || filteredOptions.length > 4) {
        this.optionsError = "Poll must have between 2 and 4 options";
        return;
      }

      this.optionsError = "";
      this.isCreatingPoll = true;
      this.createErrorMessage = "";
      this.createSuccessMessage = "";

      const options = filteredOptions;

      const request = {
        title: this.createPollForm.value.title,
        description: this.createPollForm.value.description,
        options,
      };

      this.pollService.createPoll(request).subscribe({
        next: () => {
          this.createSuccessMessage = "Poll created successfully!";
          this.resetForm();
          this.loadPolls();
          this.isCreatingPoll = false;
        },
        error: (err) => {
          console.error("Create poll error:", err);
          this.createErrorMessage =
            err.error?.message || err.message || "Failed to create poll";
          this.isCreatingPoll = false;
        },
      });
    } else {
      this.createErrorMessage =
        "Please complete all required fields before submitting.";
    }
  }

  onUpdatePoll(): void {
    if (!this.editPollId || !this.createPollForm.valid) {
      this.editErrorMessage =
        "Please complete the form before updating the poll.";
      return;
    }

    const optionsArray = this.createPollForm.get("options") as FormArray;
    const rawOptions = optionsArray.value as string[];

    const options = rawOptions
      .map((optionText, index) => ({
        optionText: optionText.trim(),
        id: this.existingOptionIds[index],
      }))
      .filter(({ optionText }) => optionText.length > 0)
      .map(({ optionText, id }) => ({ id: id!, optionText }));

    if (options.length < 2 || options.length > 4) {
      this.optionsError = "Poll must have between 2 and 4 options";
      return;
    }

    this.optionsError = "";
    this.isSavingPoll = true;
    this.editErrorMessage = "";
    this.editSuccessMessage = "";

    const request = {
      title: this.createPollForm.value.title,
      description: this.createPollForm.value.description,
      options,
    };

    this.pollService.updatePoll(this.editPollId, request).subscribe({
      next: () => {
        this.editSuccessMessage = "Poll updated successfully!";
        this.cancelEdit();
        this.loadPolls();
        this.isSavingPoll = false;
      },
      error: (err) => {
        console.error("Update poll error:", err);
        this.editErrorMessage =
          err.error?.message || err.message || "Failed to update poll";
        this.isSavingPoll = false;
      },
    });
  }

  closePoll(pollId: string): void {
    this.isUpdatingPoll = true;
    this.pollService.closePoll(pollId).subscribe({
      next: () => {
        this.loadPolls();
        this.isUpdatingPoll = false;
      },
      error: () => {
        this.isUpdatingPoll = false;
      },
    });
  }

  reopenPoll(pollId: string): void {
    this.isUpdatingPoll = true;
    this.pollService.reopenPoll(pollId).subscribe({
      next: () => {
        this.loadPolls();
        this.isUpdatingPoll = false;
      },
      error: () => {
        this.isUpdatingPoll = false;
      },
    });
  }

  deletePoll(pollId: string): void {
    if (confirm("Are you sure you want to delete this poll?")) {
      this.isUpdatingPoll = true;
      this.pollService.deletePoll(pollId).subscribe({
        next: () => {
          this.loadPolls();
          this.isUpdatingPoll = false;
        },
        error: () => {
          this.isUpdatingPoll = false;
        },
      });
    }
  }
}
