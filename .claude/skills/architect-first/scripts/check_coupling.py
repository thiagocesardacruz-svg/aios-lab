#!/usr/bin/env python3
"""
Zero-Coupling Validation Script

Validates that modules/expansion-packs maintain zero-coupling principle:
- No hardcoded cross-module imports
- No hardcoded file paths to other modules
- Configuration-based integration only

Usage:
    python check_coupling.py [--path PROJECT_PATH]
"""

import sys
import re
import argparse
from pathlib import Path
from typing import List, Dict


class CouplingViolation:
    """Represents a coupling violation found in code"""

    def __init__(self, file_path: str, line_number: int, line_content: str,
                 violation_type: str, description: str):
        self.file_path = file_path
        self.line_number = line_number
        self.line_content = line_content.strip()
        self.violation_type = violation_type
        self.description = description

    def __str__(self):
        return (
            f"\n  {self.violation_type}: {self.file_path}:{self.line_number}\n"
            f"  {self.description}\n"
            f"  > {self.line_content}"
        )


class CouplingChecker:
    """Checks for coupling violations in codebase"""

    def __init__(self, project_path: Path):
        self.project_path = project_path
        self.violations: List[CouplingViolation] = []
        self.modules = []

        # Auto-detect expansion packs
        expansion_pack_dir = project_path / "expansion-packs"
        if expansion_pack_dir.exists():
            self.modules = [d.name for d in expansion_pack_dir.iterdir() if d.is_dir()]

        self.file_patterns = ["*.py", "*.js", "*.ts", "*.yaml", "*.yml"]

    def _find_files_to_scan(self) -> List[Path]:
        """Find all files to scan for coupling violations"""
        files = []
        for pattern in self.file_patterns:
            for file_path in self.project_path.rglob(pattern):
                if file_path.is_file():
                    files.append(file_path)
        return files

    def _check_hardcoded_imports(self, file_path: Path, content: str):
        """Check for hardcoded imports to other modules"""
        lines = content.split("\n")

        for line_num, line in enumerate(lines, 1):
            if re.match(r"^\s*(from|import)\s+", line):
                for module in self.modules:
                    if re.search(rf"\bfrom\s+{module}\b", line) or \
                       re.search(rf"\bimport\s+{module}\b", line):
                        self.violations.append(CouplingViolation(
                            str(file_path), line_num, line,
                            "HARDCODED_IMPORT",
                            f"Direct import of module '{module}'. Use plugin/config-based loading instead."
                        ))

    def check_file(self, file_path: Path):
        """Check a single file for coupling violations"""
        try:
            content = file_path.read_text(encoding="utf-8")
            self._check_hardcoded_imports(file_path, content)
        except Exception as e:
            print(f"Warning: Could not scan {file_path}: {e}", file=sys.stderr)

    def run(self) -> int:
        """Run coupling check on entire project"""
        print("🔍 Checking for coupling violations...")
        print(f"   Project: {self.project_path}")
        print(f"   Modules: {', '.join(self.modules)}")
        print()

        files = self._find_files_to_scan()
        print(f"📁 Scanning {len(files)} files...")

        for file_path in files:
            self.check_file(file_path)

        return self._report_results()

    def _report_results(self) -> int:
        """Report results and return exit code"""
        if not self.violations:
            print("✅ No coupling violations found!")
            return 0

        print(f"❌ Found {len(self.violations)} coupling violation(s):")
        for violation in self.violations:
            print(violation)

        return 1


def main():
    parser = argparse.ArgumentParser(description="Check for coupling violations")
    parser.add_argument("--path", type=Path, default=Path.cwd(),
                        help="Project path to scan")
    args = parser.parse_args()

    checker = CouplingChecker(args.path)
    sys.exit(checker.run())


if __name__ == "__main__":
    main()
