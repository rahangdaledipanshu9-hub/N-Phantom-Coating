"""
Setup configuration for N-Phantom-Coating package.
"""

from setuptools import setup, find_packages
import os

# Read the contents of README file
this_directory = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(this_directory, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()

setup(
    name='n-phantom-coating',
    version='0.1.0',
    author='N-Phantom-Coating Contributors',
    author_email='your.email@example.com',
    description='A Cost-Efficient Multifunctional Stealth Coating System for Defence Applications',
    long_description=long_description,
    long_description_content_type='text/markdown',
    url='https://github.com/yourusername/N-Phantom-Coating',
    project_urls={
        'Bug Tracker': 'https://github.com/yourusername/N-Phantom-Coating/issues',
        'Documentation': 'https://n-phantom-coating.readthedocs.io',
        'Source Code': 'https://github.com/yourusername/N-Phantom-Coating',
    },
    packages=find_packages(exclude=['tests', 'docs', 'examples']),
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Science/Research',
        'Intended Audience :: Defence Industry',
        'Topic :: Scientific/Engineering :: Materials',
        'Topic :: Scientific/Engineering :: Physics',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
        'Programming Language :: Python :: 3.11',
        'Natural Language :: English',
    ],
    python_requires='>=3.8',
    install_requires=[
        'numpy>=1.21.0',
        'scipy>=1.7.0',
        'matplotlib>=3.4.0',
        'pandas>=1.3.0',
        'scikit-learn>=0.24.0',
        'scikit-image>=0.18.0',
        'pydantic>=1.8.0',
    ],
    extras_require={
        'dev': [
            'pytest>=6.2.0',
            'pytest-cov>=2.12.0',
            'black>=21.5b0',
            'flake8>=3.9.0',
            'mypy>=0.900',
            'sphinx>=4.0.0',
            'jupyter>=1.0.0',
        ],
        'docs': [
            'Sphinx>=4.0.0',
            'sphinx-rtd-theme>=1.0.0',
            'sphinx-autodoc-typehints>=1.12.0',
        ],
    },
    entry_points={
        'console_scripts': [
            'n-phantom=src.cli:main',
        ],
    },
    keywords=[
        'stealth coating',
        'radar absorption',
        'thermal camouflage',
        'defence technology',
        'materials science',
        'electromagnetic shielding',
    ],
    include_package_data=True,
    zip_safe=False,
)
