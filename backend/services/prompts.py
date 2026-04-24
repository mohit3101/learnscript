# backend/services/prompts.py
# Fixes applied:
#   MINDMAP_PROMPT  — strict Mermaid syntax rules, no emoji, no markdown in labels
#   CHEATSHEET_PROMPT — formulas kept SHORT in table cells, complex ones moved below

_FORMAT_RULES = """
FORMATTING RULES — follow exactly:

1. HEADINGS: ## for sections, ### for sub-concepts, #### for definitions
2. EMPHASIS: **Bold** every key term on first use. *Italics* for intuitions.
3. INLINE CODE: `inline code` for function names, variables, parameters
4. LISTS: - bullets for facts/properties. 1. 2. 3. for steps/processes
5. CALLOUTS: Use > for key takeaways
   > **Key Takeaway:** one-line summary
6. MATH FORMULAS:
   - Inline: $E = mc^2$
   - Block (its own paragraph, blank lines before and after):
     $$w_{new} = w_{old} - \\alpha \\nabla J(w)$$
   - Use proper LaTeX: \\sum, \\frac{}{}, \\partial, \\nabla, \\alpha, \\theta, \\hat{y}
   - NEVER write formulas as plain text
7. TABLES: Generate markdown tables for any comparison of ≥ 2 concepts
8. DIVIDERS: Use --- between major sections
"""

NOTES_PROMPT = """
You are an expert educator writing premium study notes for engineering students.

{format_rules}

STRUCTURE:

## 📌 Overview
Brief 2-3 sentence introduction.

## 🧠 Key Concepts
For each concept:
#### **Concept Name**
- **Definition** in bold
- *Intuition in italics*
- Formula in LaTeX block math if applicable
- Bullet points for properties

## 📊 Comparisons (if applicable)
Tables comparing related concepts.

## 🔢 Mathematical Foundations
Block math formulas with explanation beneath each.

## 📝 Summary
> **Key Takeaways:** 3-5 bullet points.

---

TRANSCRIPT:
{{transcript}}
""".format(format_rules=_FORMAT_RULES)

CHEATSHEET_PROMPT = """
You are creating a premium quick-reference cheat sheet.

{format_rules}

CRITICAL FORMULA RULE FOR TABLES:
- Table cells must contain ONLY SHORT formulas (max ~20 characters)
- Good cell formula: $y = mx + b$ or $E = mc^2$ or $\\sigma(z)$
- BAD cell formula: $P(Y=1|X) = \\frac{{e^{{(\\beta_0 + \\beta_1 X)}}}}{{1 + e^{{(\\beta_0 + \\beta_1 X)}}}}$
- If a formula is long or contains \\frac, place it in a SEPARATE BLOCK below the table
- Table "Formula" column should show either a SHORT inline formula OR the symbol/notation (e.g. $\\hat{{y}}$ or $\\sigma$)

STRUCTURE:

## ⚡ Quick Reference — [Topic Name]

### Core Concepts
| Concept | Description | Short Formula |
|---------|-------------|---------------|
| ... | one line max | $short$ or — |

### Key Formulas
(Complex formulas go here as block math, NOT in the table above)

$$\\text{{Formula name:}} \\quad formula = here$$

**Explanation:** What it means in plain language.

---

$$\\text{{Next formula}}$$

**Explanation:** ...

### Algorithm Comparison (if applicable)
| Algorithm | Use Case | Pros | Cons |
|-----------|----------|------|------|

### Step-by-Step Process (if applicable)
1. **Step** — description

### Common Mistakes
- ❌ **Mistake** — *why it's wrong*

> **Remember:** one exam tip.

---

TRANSCRIPT:
{{transcript}}
""".format(format_rules=_FORMAT_RULES)

CODE_PROMPT = """
You are generating clean, well-commented Python code examples from a lecture.

{format_rules}

STRUCTURE:

## 💻 Code Examples — [Topic Name]

### [Concept Name]
*Brief description in italics.*

```python
# Inline comments explain every non-obvious line
def example(param):
    \"\"\"Docstring.\"\"\"
    result = param  # explanation
    return result

# Usage
print(example(42))  # Expected: 42
```

> **Note:** Important warning or tip.

---

TRANSCRIPT:
{{transcript}}
""".format(format_rules=_FORMAT_RULES)

MINDMAP_PROMPT = """
Generate a Mermaid mindmap diagram from the lecture transcript.

STRICT RULES — violating these causes syntax errors:

1. Start with exactly:
```mermaid
mindmap
  root((Topic Name))
```

2. Indentation: use EXACTLY 2 spaces per level (no tabs)
3. Node labels:
   - Max 4 words per node
   - NO emoji (they break Mermaid syntax)
   - NO asterisks or markdown (*bold*, **bold**)
   - NO colons inside node labels
   - NO parentheses inside labels except the root((..))
   - NO special characters: & # @ $ % ^ [ ] {{ }}
   - Use plain words only: letters, numbers, spaces, hyphens

4. Structure (exactly 3 levels maximum):
```
mindmap
  root((Central Topic))
    Main Section 1
      Detail A
      Detail B
    Main Section 2
      Detail C
      Detail D
```

5. Maximum 6 main branches, maximum 4 children per branch.

6. After the diagram block, add a text summary:

## Topics Covered
- **Section 1** — one-line description
- **Section 2** — one-line description

TRANSCRIPT:
{transcript}

Output the mermaid block first, then the Topics Covered section.
"""
