#!/usr/bin/env python3
"""
Architecture Documentation Validator

Validates that architectural documentation is complete before implementation.

Usage:
    python architecture_validator.py --path <arch_doc_path>
"""

import sys
import argparse
import re
from pathlib import Path
from typing import List


class ValidationIssue:
    """Represents a validation issue"""

    def __init__(self, severity: str, category: str, message: str):
        self.severity = severity
        self.category = category
        self.message = message

    def __str__(self):
        icon = {"error": "❌", "warning": "⚠️", "info": "ℹ️"}[self.severity]
        return f"{icon} [{self.category}] {self.message}"


class ArchitectureValidator:
    """Validates architecture documentation completeness"""

    def __init__(self, doc_path: Path):
        self.doc_path = doc_path
        self.content = ""
        self.issues: List[ValidationIssue] = []
        self.required_sections = [
            "Overview", "Architecture", "Components",
            "Data Flow", "Integration", "Configuration"
        ]

    def _load_document(self) -> bool:
        """Load architecture document"""
        try:
            self.content = self.doc_path.read_text(encoding="utf-8")
            return True
        except Exception as e:
            self.issues.append(ValidationIssue("error", "DOCUMENT", f"Could not load: {e}"))
            return False

    def _check_required_sections(self):
        """Check for required sections"""
        headers = re.findall(r"^#{1,3}\s+(.+)$", self.content, re.MULTILINE)
        found = set()

        for header in headers:
            for required in self.required_sections:
                if required.lower() in header.lower():
                    found.add(required)

        missing = set(self.required_sections) - found
        for section in missing:
            self.issues.append(ValidationIssue("error", "REQUIRED_SECTION",
                                               f"Missing required section: '{section}'"))

    def run(self) -> int:
        """Run validation"""
        print("🔍 Validating architecture documentation...")
        print(f"   Document: {self.doc_path}")

        if not self._load_document():
            return 1

        self._check_required_sections()

        errors = [i for i in self.issues if i.severity == "error"]

        if not self.issues:
            print("✅ ARCHITECTURE DOCUMENTATION VALID")
            return 0

        print(f"\nErrors: {len(errors)}")
        for issue in self.issues:
            print(f"  {issue}")

        return 1 if errors else 0


def main():
    parser = argparse.ArgumentParser(description="Validate architecture documentation")
    parser.add_argument("--path", type=Path, required=True, help="Path to architecture document")
    args = parser.parse_args()

    if not args.path.exists():
        print(f"❌ Error: Document not found: {args.path}", file=sys.stderr)
        sys.exit(1)

    validator = ArchitectureValidator(args.path)
    sys.exit(validator.run())


if __name__ == "__main__":
    main()
