# ui-ux-library design system

## Overview

A design browser used at a laptop while comparing visual references: dark neutral
surfaces keep bright collected work readable without making the surrounding UI compete.
The physical scene is a focused browsing session in an evening studio, moving between
motion clips and resource links. The reference and the user's motion-first direction
support a restrained dark theme.

## Color strategy

Restrained. Near-black neutral canvas, three neutral surface levels, clear white text,
and a small violet accent (seed hue 280) for selected controls and primary actions.
OKLCH tokens in src/app/globals.css are the source of truth. Content previews may use
broader colors because they are artifacts, not interface chrome.

## Typography

System sans for compact product UI; monospace for metadata and keyboard shortcuts.
Fixed rem scale, 14–16px body, 32–40px page heading. No remote font dependency.

## Layout

Desktop: 232px full-height navigation rail, 64px top bar, broad content workspace.
Inspiration: compact heading, integrated search/filter toolbar, responsive visual collection.
Useful Sites: grouped, compact rows; each row expands in place to show context and preview.
Mobile: top navigation and horizontal section choices; controls wrap without overflow.

## Components

Small-radius buttons/inputs, 1px neutral dividers, one consistent icon family.
Selected state uses a violet fill or subtle tinted surface. Every icon action has a label.
Auth and submission dialogs have native dialog behavior, clear field labels and errors.
Private favorites use a bookmark action, never a fake count.

## Motion

Row expansion is the expressive centerpiece: approximately 350ms ease-out, with
shorter opacity/transform transitions for preview content. Other controls use 120–180ms.
No entrance gating. Reduced motion makes expansion immediate and pauses automatic previews.

## Content

Useful site links are verified seed suggestions, replaceable by the owner's collection.
Original local motion studies supply initial playable media. Do not invent X posts or authors.
