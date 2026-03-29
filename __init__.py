"""
N-Phantom-Coating: A Cost-Efficient Multifunctional Stealth Coating System

This package provides a comprehensive framework for:
- Formulation of multifunctional stealth coatings
- Application procedures for various defence platforms
- Analysis of electromagnetic and thermal behavior
- Testing and validation of coating performance
"""

__title__ = 'N-Phantom-Coating'
__version__ = '0.1.0'
__author__ = 'N-Phantom-Coating Contributors'
__license__ = 'MIT'
__copyright__ = 'Copyright (c) 2024 N-Phantom-Coating Contributors'

# Version info
VERSION = __version__

# Module imports
from src.formulation import mixer, composition, validation
from src.application import surface_prep, layer_application, curing
from src.analysis import electromagnetic, thermal, mechanical

__all__ = [
    'mixer',
    'composition',
    'validation',
    'surface_prep',
    'layer_application',
    'curing',
    'electromagnetic',
    'thermal',
    'mechanical',
]

# Package metadata
__doc__ = """
N-Phantom-Coating Documentation
==============================

A comprehensive stealth coating system designed for defence applications.

Modules:
--------
- formulation: Core coating formulation and preparation
- application: Substrate preparation and layer application
- analysis: Performance analysis and characterization

Quick Start:
-----------
>>> from src.formulation.mixer import CoatingMixer
>>> mixer = CoatingMixer()
>>> primer = mixer.prepare_primer_layer()

For detailed documentation, visit:
https://github.com/yourusername/N-Phantom-Coating
"""
