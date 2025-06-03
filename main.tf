variable "credentials" {
  description = "Path ke service account JSON file"
  type        = string
}

variable "project" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "asia-southeast2"
}

variable "create_bucket" {
  description = "Apakah bucket ingin dibuat?"
  type        = bool
  default     = true
}

provider "google" {
  credentials = file(var.credentials)
  project     = var.project
  region      = var.region
}

resource "google_storage_bucket" "static" {
  count    = var.create_bucket ? 1 : 0
  name     = "${var.project}-static-bucket"
  location = var.region
}
